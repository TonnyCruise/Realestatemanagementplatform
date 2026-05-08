import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { MaintenanceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateMaintenanceDto) {
    // Verify unit exists and tenant has an active tenancy there
    const unit = await this.prisma.unit.findUnique({ where: { id: dto.unitId } });
    if (!unit) throw new NotFoundException('Unit not found');

    const activeTenancy = await this.prisma.tenancy.findFirst({
      where: { tenantId, unitId: dto.unitId, status: 'ACTIVE' },
    });
    if (!activeTenancy) {
      throw new ForbiddenException('You do not have an active tenancy for this unit');
    }

    return this.prisma.maintenanceRequest.create({
      data: {
        unitId: dto.unitId,
        tenantId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority ?? 'MEDIUM',
        photos: dto.photos ?? [],
      },
    });
  }

  async findByUnit(unitId: string) {
    const unit = await this.prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw new NotFoundException('Unit not found');
    return this.prisma.maintenanceRequest.findMany({
      where: { unitId },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.maintenanceRequest.findMany({
      where: { tenantId },
      include: {
        unit: { select: { id: true, unitNumber: true, propertyId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLandlord(landlordId: string) {
    return this.prisma.maintenanceRequest.findMany({
      where: {
        unit: {
          property: { landlordId },
        },
      },
      include: {
        tenant: { select: { id: true, firstName: true, lastName: true, phone: true } },
        unit: {
          include: { property: { select: { id: true, title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, landlordId: string, status: MaintenanceStatus) {
    const request = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { unit: { include: { property: true } } },
    });
    if (!request) throw new NotFoundException('Maintenance request not found');
    if (request.unit.property.landlordId !== landlordId) {
      throw new ForbiddenException('You do not manage this unit');
    }

    return this.prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status,
        ...(status === 'RESOLVED' && { resolvedAt: new Date() }),
      },
    });
  }
}
