import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTenancyDto {
  @ApiProperty() @IsString() @IsNotEmpty() tenantId: string;

  @ApiProperty() @IsString() @IsNotEmpty() unitId: string;

  @ApiProperty() @IsDateString() startDate: Date;

  @ApiPropertyOptional() @IsDateString() @IsOptional() endDate?: Date;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) rentAmount: number;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) depositAmount: number;
}
