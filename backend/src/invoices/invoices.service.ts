import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(landlordId: string, dto: CreateInvoiceDto) {
    const tenancy = await this.prisma.tenancy.findUnique({
      where: { id: dto.tenancyId },
    });
    if (!tenancy) throw new NotFoundException('Tenancy not found');
    if (tenancy.landlordId !== landlordId) throw new ForbiddenException();

    // Enforce unique [tenancyId, period]
    const existing = await this.prisma.invoice.findUnique({
      where: { tenancyId_period: { tenancyId: dto.tenancyId, period: dto.period } },
    });
    if (existing) {
      throw new ConflictException(`Invoice for period ${dto.period} already exists`);
    }

    return this.prisma.invoice.create({
      data: {
        tenancyId: dto.tenancyId,
        tenantId: tenancy.tenantId,
        landlordId,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        period: dto.period,
        breakdown: dto.breakdown ?? {},
      },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
      include: {
        tenancy: {
          include: { unit: { include: { property: { select: { title: true, address: true } } } } },
        },
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  async findByLandlord(landlordId: string) {
    return this.prisma.invoice.findMany({
      where: { landlordId },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
        tenancy: { include: { unit: { select: { unitNumber: true, propertyId: true } } } },
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
        landlord: { select: { id: true, firstName: true, lastName: true } },
        tenancy: { include: { unit: { include: { property: true } } } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async markAsPaid(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return this.prisma.invoice.update({
      where: { id },
      data: { status: 'PAID' },
    });
  }

  async generateMonthlyInvoices(): Promise<{ created: number; skipped: number }> {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    // Due on the 5th of the current month
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 5);

    const activeTenancies = await this.prisma.tenancy.findMany({
      where: { status: 'ACTIVE' },
    });

    let created = 0;
    let skipped = 0;

    for (const tenancy of activeTenancies) {
      const existing = await this.prisma.invoice.findUnique({
        where: { tenancyId_period: { tenancyId: tenancy.id, period } },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await this.prisma.invoice.create({
        data: {
          tenancyId: tenancy.id,
          tenantId: tenancy.tenantId,
          landlordId: tenancy.landlordId,
          amount: tenancy.rentAmount,
          dueDate,
          period,
          breakdown: { rent: Number(tenancy.rentAmount) },
        },
      });
      created++;
    }

    return { created, skipped };
  }
}
