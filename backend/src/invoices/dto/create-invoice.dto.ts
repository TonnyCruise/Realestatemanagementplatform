import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @ApiProperty() @IsString() @IsNotEmpty() tenancyId: string;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) amount: number;

  @ApiProperty() @IsDateString() dueDate: Date;

  @ApiProperty({ description: 'Billing period e.g. "2026-05"' })
  @IsString()
  @IsNotEmpty()
  period: string;

  @ApiPropertyOptional() @IsObject() @IsOptional() breakdown?: Record<string, any>;
}
