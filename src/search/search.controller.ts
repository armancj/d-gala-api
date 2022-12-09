import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '../authentication/decorator';
import { DataBodySearchDto } from './dto/data-body-search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Post()
  @Public()
  testInsert(@Body() data: DataBodySearchDto) {
    return this.search.insertIndex(data);
  }

  @Public()
  @Get()
  testGet(@Query() data: DataBodySearchDto) {
    return this.search.searchIndex(data);
  }
}
