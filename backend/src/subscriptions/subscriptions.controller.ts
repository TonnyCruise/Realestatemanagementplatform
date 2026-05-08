import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { UpgradePlanDto } from './dto/upgrade-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptions: SubscriptionsService) {}

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Get the current landlord subscription' })
  getMySubscription(@Request() req) {
    return this.subscriptions.getMySubscription(req.user.id);
  }

  @Patch('upgrade')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Upgrade or change subscription plan' })
  upgradePlan(@Request() req, @Body() dto: UpgradePlanDto) {
    return this.subscriptions.upgradePlan(req.user.id, dto);
  }

  @Delete('cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Cancel the current subscription' })
  cancelSubscription(@Request() req) {
    return this.subscriptions.cancelSubscription(req.user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Subscription renewal webhook (public endpoint)' })
  renewalWebhook(@Body() payload: Record<string, any>) {
    return this.subscriptions.handleRenewalWebhook(payload);
  }
}
