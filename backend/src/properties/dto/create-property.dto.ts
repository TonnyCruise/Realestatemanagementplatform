import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, Country, Currency } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() description: string;
  @ApiProperty({ enum: PropertyType }) @IsEnum(PropertyType) type: PropertyType;
  @ApiProperty() @IsString() @IsNotEmpty() address: string;
  @ApiProperty() @IsString() @IsNotEmpty() city: string;
  @ApiProperty({ enum: Country }) @IsEnum(Country) country: Country;
  @ApiProperty() @IsNumber() @Type(() => Number) lat: number;
  @ApiProperty() @IsNumber() @Type(() => Number) lng: number;
  @ApiProperty() @IsNumber() @Type(() => Number) pricePerMonth: number;
  @ApiProperty({ enum: Currency }) @IsEnum(Currency) currency: Currency;
  @ApiPropertyOptional() @IsArray() @IsOptional() amenities?: string[];
  @ApiPropertyOptional() @IsArray() @IsOptional() photos?: string[];
}
