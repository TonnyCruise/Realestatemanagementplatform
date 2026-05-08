import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertiesDto } from './dto/search-properties.dto';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(landlordId: string, dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: { ...dto, landlordId },
    });
  }

  async search(query: SearchPropertiesDto) {
    const where: any = { status: 'AVAILABLE' };

    if (query.country) where.country = query.country;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.type) where.type = query.type;
    if (query.minPrice || query.maxPrice) {
      where.pricePerMonth = {};
      if (query.minPrice) where.pricePerMonth.gte = query.minPrice;
      if (query.maxPrice) where.pricePerMonth.lte = query.maxPrice;
    }

    const [total, items] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: { landlord: { select: { firstName: true, lastName: true, profilePhoto: true } } },
        orderBy: query.sortBy === 'price' ? { pricePerMonth: query.sortOrder || 'asc' } : { createdAt: 'desc' },
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
      }),
    ]);

    return { total, page: query.page || 1, limit: query.limit || 20, items };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        landlord: { select: { id: true, firstName: true, lastName: true, profilePhoto: true, phone: true } },
        units: true,
        reviews: {
          include: { reviewer: { select: { firstName: true, lastName: true, profilePhoto: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async findByLandlord(landlordId: string) {
    return this.prisma.property.findMany({
      where: { landlordId },
      include: { units: true, _count: { select: { reviews: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, landlordId: string, dto: UpdatePropertyDto) {
    await this.assertOwner(id, landlordId);
    return this.prisma.property.update({ where: { id }, data: dto });
  }

  async remove(id: string, landlordId: string) {
    await this.assertOwner(id, landlordId);
    return this.prisma.property.delete({ where: { id } });
  }

  private async assertOwner(propertyId: string, landlordId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.landlordId !== landlordId) throw new ForbiddenException();
  }
}
