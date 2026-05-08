import { IsEnum, IsNumber, IsOptional, IsString, IsPositive, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Country, PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';

export class SearchPropertiesDto {
  @ApiPropertyOptional({ enum: Country }) @IsEnum(Country) @IsOptional() country?: Country;
  @ApiPropertyOptional() @IsString() @IsOptional() city?: string;
  @ApiPropertyOptional({ enum: PropertyType }) @IsEnum(PropertyType) @IsOptional() type?: PropertyType;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) minPrice?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) maxPrice?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) lat?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) lng?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) radiusKm?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() sortBy?: 'price' | 'rating' | 'newest';
  @ApiPropertyOptional() @IsString() @IsOptional() sortOrder?: 'asc' | 'desc';
  @ApiPropertyOptional() @IsNumber() @IsPositive() @IsOptional() @Type(() => Number) page?: number;
  @ApiPropertyOptional() @IsNumber() @Min(1) @IsOptional() @Type(() => Number) limit?: number;
}
