import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetUser, Public } from '../../authentication/decorator';
import { GetAllQueryDto } from '../../common/dto';
import { EnumUserRole } from '../../user/enum/user-role.enum';
import { UserPayload } from '../../user/interface/user-payload';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Auth(EnumUserRole.WORKER, EnumUserRole.SUADMIN, EnumUserRole.ADMIN)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: UserPayload,
  ) {
    return this.categoryService.createCategory(createCategoryDto, user);
  }

  @Public()
  @Get()
  findAll(@Query() getAllQueryDto: GetAllQueryDto) {
    return this.categoryService.findAllCategory(getAllQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
