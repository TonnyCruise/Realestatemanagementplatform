import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
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

    // Create a pending payment record; actual provider integration happens via webhook
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: dto.invoiceId,
        payerId,
        amount: invoice.amount,
        currency: payer.country === 'KE' ? 'KES' : payer.country === 'TZ' ? 'TZS' : 'UGX',
        method: dto.method,
        status: 'PENDING',
      },
    });

    // TODO: Call Flutterwave API to initiate payment and store providerRef
    // const fw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
    // const response = await fw.charge.mobilemoney({ phone_number: dto.phone, amount: ..., currency: ..., ... });
    // await this.prisma.payment.update({ where: { id: payment.id }, data: { providerRef: response.data.flw_ref } });

    return payment;
  }

  async handleFlutterwaveWebhook(payload: Record<string, any>) {
    const { status, tx_ref: providerRef, id: flwId } = payload?.data ?? {};

    if (!providerRef) return { received: true };

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef },
      include: { invoice: true, payer: true },
    });

    if (!payment) return { received: true };

    if (status === 'successful' && payment.status !== 'SUCCESS') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            providerData: payload,
          },
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

      // Notify landlord
      await this.notifications.create(payment.invoice.landlordId, {
        title: 'Rent Received',
        body: `A rent payment of ${Number(payment.amount).toLocaleString()} has been received.`,
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
