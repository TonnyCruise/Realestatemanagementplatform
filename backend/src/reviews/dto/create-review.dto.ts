import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty() @IsString() @IsNotEmpty() propertyId: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiPropertyOptional() @IsString() @IsOptional() title?: string;

  @ApiProperty() @IsString() @IsNotEmpty() body: string;

  @ApiPropertyOptional({ description: 'Category scores e.g. { cleanliness: 5, location: 4 }' })
  @IsObject()
  @IsOptional()
  categories?: Record<string, number>;
}
