import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty() @IsString() @IsNotEmpty() userId: string;

  @ApiProperty() @IsString() @IsNotEmpty() title: string;

  @ApiProperty() @IsString() @IsNotEmpty() body: string;

  @ApiProperty({ enum: NotificationType }) @IsEnum(NotificationType) type: NotificationType;

  @ApiPropertyOptional() @IsObject() @IsOptional() data?: Record<string, any>;
}
