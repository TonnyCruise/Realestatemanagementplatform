import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface PlatformStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  totalRevenue: number;
  activeSubscriptions: number;
  countByCountry: Record<string, number>;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats(): Promise<PlatformStats> {
    const [
      totalUsers,
      totalLandlords,
      totalTenants,
      totalProperties,
      revenueResult,
      activeSubscriptions,
      usersByCountry,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'LANDLORD' } }),
      this.prisma.user.count({ where: { role: 'TENANT' } }),
      this.prisma.property.count(),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.user.groupBy({
        by: ['country'],
        _count: { id: true },
      }),
    ]);

    const countByCountry: Record<string, number> = {};
    for (const entry of usersByCountry) {
      countByCountry[entry.country] = entry._count.id;
    }

    return {
      totalUsers,
      totalLandlords,
      totalTenants,
      totalProperties,
      totalRevenue: Number(revenueResult._sum.amount ?? 0),
      activeSubscriptions,
      countByCountry,
    };
  }

  async getAllUsers(query: { page?: number; limit?: number; role?: string; search?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          country: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          subscription: { select: { plan: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { total, page, limit, items };
  }

  async getAllProperties(query: { page?: number; limit?: number; country?: string; status?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.country) where.country = query.country;
    if (query.status) where.status = query.status;

    const [total, items] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: {
          landlord: { select: { id: true, firstName: true, lastName: true, phone: true } },
          _count: { select: { units: true, reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { total, page, limit, items };
  }
}
