import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private uploads: UploadsService) {}

  @Post('sign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Cloudinary signed upload params for direct browser upload' })
  sign(@Query('folder') folder = 'nestea/properties') {
    return this.uploads.getSignedUploadParams(folder);
  }
}
