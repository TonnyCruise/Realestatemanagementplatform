import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit a review for a property' })
  create(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviews.create(req.user.id, dto);
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get all reviews for a property (public)' })
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.reviews.findByProperty(propertyId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete your own review' })
  remove(@Param('id') id: string, @Request() req) {
    return this.reviews.remove(id, req.user.id);
  }
}
