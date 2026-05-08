import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Units')
@Controller('units')
export class UnitsController {
  constructor(private units: UnitsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Create a unit inside a property' })
  create(
    @Request() req,
    @Query('propertyId') propertyId: string,
    @Body() dto: CreateUnitDto,
  ) {
    return this.units.create(propertyId, req.user.id, dto);
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'List all units for a property' })
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.units.findByProperty(propertyId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Update a unit' })
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateUnitDto) {
    return this.units.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  @ApiOperation({ summary: 'Delete a unit' })
  remove(@Param('id') id: string, @Request() req) {
    return this.units.remove(id, req.user.id);
  }
}
