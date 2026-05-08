import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenancyDto } from './dto/create-tenancy.dto';

@Injectable()
export class TenanciesService {
  constructor(private prisma: PrismaService) {}

  async create(landlordId: string, dto: CreateTenancyDto) {
    // Verify unit exists and landlord owns the parent property
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.unitId },
      include: { property: true },
    });
    if (!unit) throw new NotFoundException('Unit not found');
    if (unit.property.landlordId !== landlordId) {
      throw new ForbiddenException('You do not own this unit');
    }
    if (unit.status === 'OCCUPIED') {
      throw new BadRequestException('Unit is already occupied');
    }

    // Verify tenant exists
    const tenant = await this.prisma.user.findUnique({ where: { id: dto.tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const [tenancy] = await this.prisma.$transaction([
      this.prisma.tenancy.create({
        data: {
          tenantId: dto.tenantId,
          unitId: dto.unitId,
          landlordId,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          rentAmount: dto.rentAmount,
          depositAmount: dto.depositAmount,
          status: 'ACTIVE',
        },
        include: {
          tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
          unit: true,
        },
      }),
      this.prisma.unit.update({
        where: { id: dto.unitId },
        data: { status: 'OCCUPIED' },
      }),
    ]);

    return tenancy;
  }

  async findByLandlord(landlordId: string) {
    return this.prisma.tenancy.findMany({
      where: { landlordId },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true, profilePhoto: true } },
        unit: { include: { property: { select: { id: true, title: true, address: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.tenancy.findMany({
      where: { tenantId },
      include: {
        unit: {
          include: {
            property: {
              select: { id: true, title: true, address: true, city: true, photos: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenancy = await this.prisma.tenancy.findUnique({
      where: { id },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
        landlord: { select: { id: true, firstName: true, lastName: true, phone: true } },
        unit: { include: { property: true } },
        invoices: { orderBy: { createdAt: 'desc' }, take: 12 },
      },
    });
    if (!tenancy) throw new NotFoundException('Tenancy not found');
    return tenancy;
  }

  async endTenancy(id: string, landlordId: string) {
    const tenancy = await this.prisma.tenancy.findUnique({
      where: { id },
      include: { unit: true },
    });
    if (!tenancy) throw new NotFoundException('Tenancy not found');
    if (tenancy.landlordId !== landlordId) throw new ForbiddenException();
    if (tenancy.status === 'ENDED') {
      throw new BadRequestException('Tenancy is already ended');
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.tenancy.update({
        where: { id },
        data: { status: 'ENDED', endDate: new Date() },
      }),
      this.prisma.unit.update({
        where: { id: tenancy.unitId },
        data: { status: 'VACANT' },
      }),
    ]);

    return updated;
  }
}
