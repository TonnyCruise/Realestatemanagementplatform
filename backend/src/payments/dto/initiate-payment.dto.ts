import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class InitiatePaymentDto {
  @ApiProperty() @IsString() @IsNotEmpty() invoiceId: string;

  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Phone number for M-Pesa / mobile money' })
  @IsString()
  @IsOptional()
  phone?: string;
}
