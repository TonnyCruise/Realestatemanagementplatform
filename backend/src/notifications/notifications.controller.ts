import { Controller, Get, Patch, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get('mine')
  @ApiOperation({ summary: 'Get notifications for the authenticated user' })
  findMine(@Request() req, @Query('unread') unread?: string) {
    return this.notifications.findByUser(req.user.id, unread === 'true');
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@Request() req) {
    return this.notifications.markAllRead(req.user.id);
  }
}
