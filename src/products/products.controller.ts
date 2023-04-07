import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryProductsDto } from './dto/query-products.dto';
import { Auth } from '../authentication/decorator';
import { EnumUserRole } from '../user/enum/user-role.enum';
import { GetUser, Public } from '../authentication/decorator';
import { User } from '@prisma/client';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Product created successfully',
  })
  @ApiConflictResponse({
    description: 'The product is duplicated',
  })
  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.WORKER)
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Public()
  @Get()
  findAll(@Query() queryProductsDto: QueryProductsDto) {
    return this.productsService.findAll(queryProductsDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.remove(+id);
  }
}
