import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPropertiesDto } from '../properties/dto/search-properties.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProperties(query: SearchPropertiesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    // When lat/lng/radiusKm are all provided, use Haversine formula via raw SQL
    if (
      query.lat !== undefined &&
      query.lng !== undefined &&
      query.radiusKm !== undefined
    ) {
      return this.searchByGeoProximity(query, page, limit, offset);
    }

    // Fallback: Prisma ORM-based filter
    return this.searchByFilters(query, page, limit, offset);
  }

  private async searchByGeoProximity(
    query: SearchPropertiesDto,
    page: number,
    limit: number,
    offset: number,
  ) {
    const { lat, lng, radiusKm } = query;

    // Build optional filter clauses
    const countryFilter = query.country ? `AND p.country = '${query.country}'::\"Country\"` : '';
    const cityFilter = query.city ? `AND LOWER(p.city) LIKE LOWER('%${query.city.replace(/'/g, "''")}%')` : '';
    const typeFilter = query.type ? `AND p.type = '${query.type}'::\"PropertyType\"` : '';
    const minPriceFilter = query.minPrice !== undefined ? `AND p."pricePerMonth" >= ${query.minPrice}` : '';
    const maxPriceFilter = query.maxPrice !== undefined ? `AND p."pricePerMonth" <= ${query.maxPrice}` : '';

    const orderClause =
      query.sortBy === 'price'
        ? `ORDER BY p."pricePerMonth" ${query.sortOrder === 'desc' ? 'DESC' : 'ASC'}`
        : query.sortBy === 'rating'
        ? `ORDER BY p."avgRating" DESC`
        : `ORDER BY distance ASC`;

    // Haversine formula: distance in km
    const haversineExpr = `
      (6371 * acos(
        LEAST(1.0, cos(radians(${lat})) * cos(radians(CAST(p.lat AS float8)))
          * cos(radians(CAST(p.lng AS float8)) - radians(${lng}))
          + sin(radians(${lat})) * sin(radians(CAST(p.lat AS float8)))
        )
      ))
    `;

    const rawItems = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
        p.id, p.title, p.description, p.type, p.address, p.city, p.country,
        p.lat, p.lng, p."pricePerMonth", p.currency, p.status,
        p.amenities, p.photos, p."avgRating", p."totalReviews",
        p."isFeatured", p."isVerified", p."createdAt",
        ${haversineExpr} AS distance
      FROM properties p
      WHERE p.status = 'AVAILABLE'
        ${countryFilter}
        ${cityFilter}
        ${typeFilter}
        ${minPriceFilter}
        ${maxPriceFilter}
        AND ${haversineExpr} <= ${radiusKm}
      ${orderClause}
      LIMIT ${limit} OFFSET ${offset}
    `);

    const countResult = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(`
      SELECT COUNT(*) AS count
      FROM properties p
      WHERE p.status = 'AVAILABLE'
        ${countryFilter}
        ${cityFilter}
        ${typeFilter}
        ${minPriceFilter}
        ${maxPriceFilter}
        AND ${haversineExpr} <= ${radiusKm}
    `);

    const total = Number(countResult[0]?.count ?? 0);

    return {
      total,
      page,
      limit,
      items: rawItems,
    };
  }

  private async searchByFilters(
    query: SearchPropertiesDto,
    page: number,
    limit: number,
    offset: number,
  ) {
    const where: any = { status: 'AVAILABLE' };

    if (query.country) where.country = query.country;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.type) where.type = query.type;
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.pricePerMonth = {};
      if (query.minPrice !== undefined) where.pricePerMonth.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.pricePerMonth.lte = query.maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === 'price') {
      orderBy = { pricePerMonth: query.sortOrder ?? 'asc' };
    } else if (query.sortBy === 'rating') {
      orderBy = { avgRating: 'desc' };
    }

    const [total, items] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        include: {
          landlord: {
            select: { id: true, firstName: true, lastName: true, profilePhoto: true },
          },
          _count: { select: { units: true } },
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
    ]);

    return { total, page, limit, items };
  }
}
