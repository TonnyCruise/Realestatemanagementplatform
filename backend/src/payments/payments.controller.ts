import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TENANT', 'LANDLORD')
  @ApiOperation({ summary: 'Initiate a payment for an invoice' })
  initiatePayment(@Request() req, @Body() dto: InitiatePaymentDto) {
    return this.payments.initiatePayment(req.user.id, dto);
  }

  @Post('webhook/flutterwave')
  @ApiOperation({ summary: 'Flutterwave payment webhook (public endpoint)' })
  flutterwaveWebhook(@Body() payload: Record<string, any>) {
    return this.payments.handleFlutterwaveWebhook(payload);
  }

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all payments made by the authenticated user' })
  findMine(@Request() req) {
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
