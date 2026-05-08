import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getMe(@Request() req) {
    return this.users.findById(req.user.id);
  }

  @Patch('me')
  updateMe(@Request() req, @Body() body: { firstName?: string; lastName?: string; profilePhoto?: string }) {
    return this.users.updateProfile(req.user.id, body);
  }
}
