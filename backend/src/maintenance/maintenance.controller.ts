import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MaintenanceStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

class UpdateStatusDto {
  @ApiProperty({ enum: MaintenanceStatus }) @IsEnum(MaintenanceStatus) status: MaintenanceStatus;
}

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private maintenance: MaintenanceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TENANT')
  @ApiOperation({ summary: 'Submit a maintenance request' })
  create(@Request() req, @Body() dto: CreateMaintenanceDto) {
    return this.maintenance.create(req.user.id, dto);
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles('TENANT')
  @ApiOperation({ summary: 'Get maintenance requests submitted by the authenticated tenant' })
  findMine(@Request() req) {
    return this.maintenance.findByTenant(req.user.id);
  }

  @Get('landlord/all')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Get all maintenance requests for properties owned by the landlord' })
  findByLandlord(@Request() req) {
    return this.maintenance.findByLandlord(req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Update the status of a maintenance request' })
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.maintenance.updateStatus(id, req.user.id, dto.status);
  }
}
