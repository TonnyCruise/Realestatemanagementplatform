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
import { TenanciesService } from './tenancies.service';
import { CreateTenancyDto } from './dto/create-tenancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Tenancies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenancies')
export class TenanciesController {
  constructor(private tenancies: TenanciesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Create a new tenancy' })
  create(@Request() req, @Body() dto: CreateTenancyDto) {
    return this.tenancies.create(req.user.id, dto);
  }

  @Get('landlord/mine')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Get all tenancies for the authenticated landlord' })
  findByLandlord(@Request() req) {
    return this.tenancies.findByLandlord(req.user.id);
  }

  @Get('tenant/mine')
  @UseGuards(RolesGuard)
  @Roles('TENANT')
  @ApiOperation({ summary: 'Get all tenancies for the authenticated tenant' })
  findByTenant(@Request() req) {
    return this.tenancies.findByTenant(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single tenancy by ID' })
  findOne(@Param('id') id: string) {
    return this.tenancies.findOne(id);
  }

  @Patch(':id/end')
  @UseGuards(RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'End an active tenancy' })
  endTenancy(@Param('id') id: string, @Request() req) {
    return this.tenancies.endTenancy(id, req.user.id);
  }
}
