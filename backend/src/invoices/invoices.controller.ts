import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Create an invoice for a tenancy' })
  create(@Request() req, @Body() dto: CreateInvoiceDto) {
    return this.invoices.create(req.user.id, dto);
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles('TENANT')
  @ApiOperation({ summary: 'Get all invoices for the authenticated tenant' })
  findMine(@Request() req) {
    return this.invoices.findByTenant(req.user.id);
  }

  @Get('landlord/all')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Get all invoices issued by the authenticated landlord' })
  findByLandlord(@Request() req) {
    return this.invoices.findByLandlord(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single invoice by ID' })
  findOne(@Param('id') id: string) {
    return this.invoices.findOne(id);
  }

  @Patch(':id/mark-paid')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Manually mark an invoice as paid' })
  markAsPaid(@Param('id') id: string) {
    return this.invoices.markAsPaid(id);
  }
}
