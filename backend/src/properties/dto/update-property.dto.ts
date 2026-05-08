import { PartialType } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PropertyStatus } from '@prisma/client';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @IsEnum(PropertyStatus) @IsOptional() status?: PropertyStatus;
}
