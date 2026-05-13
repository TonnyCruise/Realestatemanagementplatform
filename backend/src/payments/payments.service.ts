import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private config: ConfigService,
  ) {}

  async initiatePayment(payerId: string, dto: InitiatePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: dto.invoiceId },
      include: { tenancy: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.tenantId !== payerId && invoice.landlordId !== payerId) {
      throw new ForbiddenException('You are not associated with this invoice');
    }
    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
    }

    const payer = await this.prisma.user.findUnique({ where: { id: payerId } });
    if (!payer) throw new NotFoundException('Payer not found');

    const currency = payer.country === 'KE' ? 'KES' : payer.country === 'TZ' ? 'TZS' : 'UGX';
    const txRef = `nestea-${invoice.id}-${uuidv4().slice(0, 8)}`;

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: dto.invoiceId,
        payerId,
        amount: invoice.amount,
        currency,
        method: dto.method,
        status: 'PENDING',
        providerRef: txRef,
      },
    });

    // Return config for Flutterwave inline SDK
    return {
      paymentId: payment.id,
      txRef,
      publicKey: this.config.get('FLUTTERWAVE_PUBLIC_KEY'),
      amount: Number(invoice.amount),
      currency,
      customer: {
        email: payer.email ?? `${payer.phone.replace('+', '')}@nestea.app`,
        phone_number: payer.phone,
        name: `${payer.firstName} ${payer.lastName}`,
      },
      meta: {
        invoiceId: invoice.id,
        paymentId: payment.id,
        period: invoice.period,
      },
    };
  }

  async initiateSTKPush(payerId: string, invoiceId: string, phone: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.tenantId !== payerId) throw new ForbiddenException();
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice is already paid');

    const consumerKey = this.config.get('MPESA_CONSUMER_KEY');
    const consumerSecret = this.config.get('MPESA_CONSUMER_SECRET');
    const shortcode = this.config.get('MPESA_SHORTCODE');
    const passkey = this.config.get('MPESA_PASSKEY');
    const callbackUrl = this.config.get('MPESA_CALLBACK_URL');

    // Get OAuth token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } },
    );
    const accessToken = tokenRes.data.access_token;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const sanitizedPhone = phone.startsWith('+') ? phone.slice(1) : phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(Number(invoice.amount)),
        PartyA: sanitizedPhone,
        PartyB: shortcode,
        PhoneNumber: sanitizedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `INV-${invoice.id.slice(0, 8).toUpperCase()}`,
        TransactionDesc: `Rent payment for ${invoice.period}`,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const txRef = `mpesa-${invoice.id}-${uuidv4().slice(0, 8)}`;
    await this.prisma.payment.create({
      data: {
        invoiceId,
        payerId,
        amount: invoice.amount,
        currency: 'KES',
        method: 'MPESA',
        status: 'PENDING',
        providerRef: stkRes.data.CheckoutRequestID ?? txRef,
      },
    });

    return {
      checkoutRequestId: stkRes.data.CheckoutRequestID,
      merchantRequestId: stkRes.data.MerchantRequestID,
      message: 'STK Push sent. Enter your M-Pesa PIN to complete.',
    };
  }

  verifyFlutterwaveSignature(payload: string, signature: string): boolean {
    const secret = this.config.get<string>('FLUTTERWAVE_WEBHOOK_SECRET', '');
    if (!secret) return true; // skip verification in dev if no secret set
    const hash = createHmac('sha256', secret).update(payload).digest('hex');
    return hash === signature;
  }

  async handleFlutterwaveWebhook(rawPayload: string, signature: string) {
    if (!this.verifyFlutterwaveSignature(rawPayload, signature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const payload = JSON.parse(rawPayload);
    const { status, tx_ref: txRef } = payload?.data ?? {};

    if (!txRef) return { received: true };

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: txRef },
      include: { invoice: true, payer: true },
    });

    if (!payment) return { received: true };

    if (status === 'successful' && payment.status !== 'SUCCESS') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', paidAt: new Date(), providerData: payload },
        }),
        this.prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'PAID' },
        }),
      ]);

      await this.notifications.create(payment.payer.id, {
        title: 'Payment Successful',
        body: `Your payment of ${Number(payment.amount).toLocaleString()} has been confirmed.`,
        type: 'RENT_PAID',
        data: { invoiceId: payment.invoiceId, paymentId: payment.id },
      });

      await this.notifications.create(payment.invoice.landlordId, {
        title: 'Rent Received',
        body: `Rent payment of ${Number(payment.amount).toLocaleString()} received.`,
        type: 'RENT_PAID',
        data: { invoiceId: payment.invoiceId, paymentId: payment.id },
      });
    } else if (status === 'failed') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', providerData: payload },
      });
    }

    return { received: true };
  }

  async handleMpesaCallback(payload: any) {
    const result = payload?.Body?.stkCallback;
    if (!result) return { received: true };

    const checkoutRequestId = result.CheckoutRequestID;
    const resultCode = result.ResultCode;

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: checkoutRequestId },
      include: { invoice: true, payer: true },
    });

    if (!payment) return { received: true };

    if (resultCode === 0) {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS', paidAt: new Date(), providerData: payload },
        }),
        this.prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'PAID' },
        }),
      ]);

      await this.notifications.create(payment.payer.id, {
        title: 'M-Pesa Payment Confirmed',
        body: `Your rent payment has been received.`,
        type: 'RENT_PAID',
        data: { invoiceId: payment.invoiceId },
      });
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', providerData: payload },
      });
    }

    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }

  async findByInvoice(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return this.prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPayer(payerId: string) {
    return this.prisma.payment.findMany({
      where: { payerId },
      include: {
        invoice: { select: { id: true, period: true, amount: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
