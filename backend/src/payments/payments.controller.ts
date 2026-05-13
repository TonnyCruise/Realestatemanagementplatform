import {
  Controller, Get, Post, Body, Param, UseGuards, Req, Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

class STKPushDto {
  @ApiProperty() @IsString() @IsNotEmpty() invoiceId: string;
  @ApiProperty({ description: 'Phone in format +2547XXXXXXXX or 07XXXXXXXX' })
  @IsString() @IsNotEmpty() phone: string;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT', 'LANDLORD')
  @ApiOperation({ summary: 'Initiate a Flutterwave payment — returns config for inline SDK' })
  initiatePayment(@Req() req: Request & { user: any }, @Body() dto: InitiatePaymentDto) {
    return this.payments.initiatePayment(req.user.id, dto);
  }

  @Post('mpesa-stk')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT')
  @ApiOperation({ summary: 'Trigger M-Pesa STK Push for an invoice' })
  stkPush(@Req() req: Request & { user: any }, @Body() dto: STKPushDto) {
    return this.payments.initiateSTKPush(req.user.id, dto.invoiceId, dto.phone);
  }

  @Post('webhook/flutterwave')
  @ApiOperation({ summary: 'Flutterwave webhook (public — signature verified internally)' })
  flutterwaveWebhook(
    @Req() req: Request,
    @Headers('verif-hash') signature: string,
    @Body() _body: any,
  ) {
    const raw = (req as any).rawBody?.toString() ?? JSON.stringify(_body);
    return this.payments.handleFlutterwaveWebhook(raw, signature);
  }

  @Post('webhook/mpesa')
  @ApiOperation({ summary: 'M-Pesa Daraja callback (public)' })
  mpesaCallback(@Body() payload: any) {
    return this.payments.handleMpesaCallback(payload);
  }

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all payments by the authenticated user' })
  findMine(@Req() req: Request & { user: any }) {
    return this.payments.findByPayer(req.user.id);
  }

  @Get('invoice/:invoiceId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all payments for a specific invoice' })
  findByInvoice(@Param('invoiceId') invoiceId: string) {
    return this.payments.findByInvoice(invoiceId);
  }
}
