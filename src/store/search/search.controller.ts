import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post(':index')
  insert(@Param('index') index: string, @Body() product: any) {
    return this.searchService.insertIndex({ index, product });
  }

  @Delete(':index/:id')
  delete(@Param('index') index: string, @Param('id') id: string) {
    return this.searchService.deleteIndex(index, id);
  }

  @Put(':index/:id')
  update(
    @Param('index') index: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.searchService.updateIndex(index, id, body);
  }

  @Get(':index/:name')
  search(@Param('index') index: string, @Body() body: any) {
    return this.searchService.searchIndex(index, body);
  }
}
