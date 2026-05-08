import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaintenanceCategory, MaintenancePriority } from '@prisma/client';

export class CreateMaintenanceDto {
  @ApiProperty() @IsString() @IsNotEmpty() unitId: string;

  @ApiProperty() @IsString() @IsNotEmpty() title: string;

  @ApiProperty() @IsString() @IsNotEmpty() description: string;

  @ApiProperty({ enum: MaintenanceCategory }) @IsEnum(MaintenanceCategory) category: MaintenanceCategory;

  @ApiPropertyOptional({ enum: MaintenancePriority })
  @IsEnum(MaintenancePriority)
  @IsOptional()
  priority?: MaintenancePriority;

  @ApiPropertyOptional({ type: [String], description: 'Array of photo URLs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];
}
