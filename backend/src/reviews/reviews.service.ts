import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });
    if (!property) throw new NotFoundException('Property not found');

    const existing = await this.prisma.review.findUnique({
      where: { propertyId_reviewerId: { propertyId: dto.propertyId, reviewerId } },
    });
    if (existing) throw new ConflictException('You have already reviewed this property');

    // Check if reviewer is a verified tenant of this property
    const tenancy = await this.prisma.tenancy.findFirst({
      where: {
        tenantId: reviewerId,
        unit: { propertyId: dto.propertyId },
        status: { in: ['ACTIVE', 'ENDED'] },
      },
    });

    const review = await this.prisma.review.create({
      data: {
        propertyId: dto.propertyId,
        reviewerId,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
        categories: dto.categories ?? {},
        isVerifiedTenant: !!tenancy,
      },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, profilePhoto: true } },
      },
    });

    await this.recalculatePropertyRating(dto.propertyId);

    return review;
  }

  async findByProperty(propertyId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    return this.prisma.review.findMany({
      where: { propertyId },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, profilePhoto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: { select: { id: true, firstName: true, lastName: true, profilePhoto: true } },
        property: { select: { id: true, title: true } },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async remove(id: string, reviewerId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== reviewerId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }
    await this.prisma.review.delete({ where: { id } });
    await this.recalculatePropertyRating(review.propertyId);
    return { deleted: true };
  }

  private async recalculatePropertyRating(propertyId: string) {
    const result = await this.prisma.review.aggregate({
      where: { propertyId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        avgRating: result._avg.rating ?? 0,
        totalReviews: result._count.id,
      },
    });
  }
}
