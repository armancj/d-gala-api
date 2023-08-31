import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorator';
import { GetAllQueryV2Dto } from '../../common/dto/get-all-query-v2.dto';
import {FilterByColorDto, SearchAndFilterDto} from './dto/filter-by-color.dto';
import { GetAllQueryResponseDto } from '../../common/dto/get-all-query-response.dto';

@Public()
@ApiTags('colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  findAll(@Query() searchAndFilterDto: SearchAndFilterDto) {
    return this.colorsService.findAll(searchAndFilterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(+id, updateColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorsService.remove(+id);
  }
}
