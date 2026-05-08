import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpgradePlanDto } from './dto/upgrade-plan.dto';

// Monthly prices in KES per plan (adjust per country/currency as needed)
const PLAN_PRICES: Record<string, Record<string, number>> = {
  STARTER: { MONTHLY: 0, ANNUAL: 0 },
  GROWTH: { MONTHLY: 2500, ANNUAL: 25000 },
  ENTERPRISE: { MONTHLY: 7500, ANNUAL: 75000 },
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getMySubscription(landlordId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { landlordId },
      include: { landlord: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');
    return subscription;
  }

  async upgradePlan(landlordId: string, dto: UpgradePlanDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { landlordId },
      include: { landlord: true },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    const country = subscription.landlord.country;
    const currency = country === 'KE' ? 'KES' : country === 'TZ' ? 'TZS' : 'UGX';
    const price = PLAN_PRICES[dto.plan]?.[dto.billingCycle] ?? 0;

    const now = new Date();
    const periodEnd =
      dto.billingCycle === 'ANNUAL'
        ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    return this.prisma.subscription.update({
      where: { landlordId },
      data: {
        plan: dto.plan,
        billingCycle: dto.billingCycle,
        price,
        currency,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelledAt: null,
      },
    });
  }

  async cancelSubscription(landlordId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { landlordId },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');
    if (subscription.status === 'CANCELLED') {
      throw new BadRequestException('Subscription is already cancelled');
    }

    return this.prisma.subscription.update({
      where: { landlordId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
  }

  async handleRenewalWebhook(payload: Record<string, any>) {
    const { status, meta } = payload ?? {};
    const landlordId: string | undefined = meta?.landlordId;

    if (!landlordId) return { received: true };

    const subscription = await this.prisma.subscription.findUnique({
      where: { landlordId },
    });
    if (!subscription) return { received: true };

    if (status === 'successful') {
      const now = new Date();
      const periodEnd =
        subscription.billingCycle === 'ANNUAL'
          ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
          : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

      await this.prisma.subscription.update({
        where: { landlordId },
        data: {
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });
    } else if (status === 'failed') {
      await this.prisma.subscription.update({
        where: { landlordId },
        data: { status: 'PAST_DUE' },
      });
    }

    return { received: true };
  }
}
