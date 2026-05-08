import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async create(propertyId: string, landlordId: string, dto: CreateUnitDto) {
    await this.assertPropertyOwner(propertyId, landlordId);
    return this.prisma.unit.create({
      data: {
        propertyId,
        unitNumber: dto.unitNumber,
        floor: dto.floor,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        sizeSqft: dto.sizeSqft,
        monthlyRent: dto.monthlyRent,
      },
    });
  }

  async findByProperty(propertyId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    return this.prisma.unit.findMany({
      where: { propertyId },
      orderBy: { unitNumber: 'asc' },
    });
  }

  async update(id: string, landlordId: string, dto: UpdateUnitDto) {
    const unit = await this.assertUnitOwner(id, landlordId);
    return this.prisma.unit.update({
      where: { id: unit.id },
      data: {
        ...(dto.unitNumber !== undefined && { unitNumber: dto.unitNumber }),
        ...(dto.floor !== undefined && { floor: dto.floor }),
        ...(dto.bedrooms !== undefined && { bedrooms: dto.bedrooms }),
        ...(dto.bathrooms !== undefined && { bathrooms: dto.bathrooms }),
        ...(dto.sizeSqft !== undefined && { sizeSqft: dto.sizeSqft }),
        ...(dto.monthlyRent !== undefined && { monthlyRent: dto.monthlyRent }),
      },
    });
  }

  async remove(id: string, landlordId: string) {
    const unit = await this.assertUnitOwner(id, landlordId);
    return this.prisma.unit.delete({ where: { id: unit.id } });
  }

  private async assertPropertyOwner(propertyId: string, landlordId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.landlordId !== landlordId) throw new ForbiddenException('You do not own this property');
    return property;
  }

  private async assertUnitOwner(unitId: string, landlordId: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
      include: { property: true },
    });
    if (!unit) throw new NotFoundException('Unit not found');
    if (unit.property.landlordId !== landlordId) throw new ForbiddenException('You do not own this unit');
    return unit;
  }
}
