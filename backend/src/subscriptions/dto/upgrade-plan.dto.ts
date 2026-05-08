import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle, SubscriptionPlan } from '@prisma/client';

export class UpgradePlanDto {
  @ApiProperty({ enum: SubscriptionPlan }) @IsEnum(SubscriptionPlan) plan: SubscriptionPlan;

  @ApiProperty({ enum: BillingCycle }) @IsEnum(BillingCycle) billingCycle: BillingCycle;
}
