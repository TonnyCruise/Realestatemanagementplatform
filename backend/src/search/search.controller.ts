import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchPropertiesDto } from '../properties/dto/search-properties.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private search: SearchService) {}

  @Get('properties')
  @ApiOperation({ summary: 'Search properties by location, filters, or geo-proximity' })
  searchProperties(@Query() query: SearchPropertiesDto) {
    return this.search.searchProperties(query);
  }
}
