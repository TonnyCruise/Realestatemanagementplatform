import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUnitDto {
  @ApiProperty() @IsString() @IsNotEmpty() unitNumber: string;

  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) floor?: number;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) bedrooms: number;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) bathrooms: number;

  @ApiPropertyOptional() @IsNumber() @IsOptional() @Type(() => Number) sizeSqft?: number;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) monthlyRent: number;
}
