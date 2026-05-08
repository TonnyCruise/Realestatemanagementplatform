import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertiesDto } from './dto/search-properties.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private properties: PropertiesService) {}

  @Get()
  search(@Query() query: SearchPropertiesDto) {
    return this.properties.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.properties.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  create(@Request() req, @Body() dto: CreatePropertyDto) {
    return this.properties.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdatePropertyDto) {
    return this.properties.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  remove(@Param('id') id: string, @Request() req) {
    return this.properties.remove(id, req.user.id);
  }

  @Get('landlord/mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD')
  myProperties(@Request() req) {
    return this.properties.findByLandlord(req.user.id);
  }
}
