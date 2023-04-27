import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QueryProductsDto } from './dto/query-products.dto';
import { Auth, GetUser, Public } from '../../authentication/decorator';
import { EnumUserRole } from '../../user/enum/user-role.enum';
import { User } from '@prisma/client';
import { GetAllQueryDto } from '../../common/dto';
import { CreateReviewDto } from './dto/create-review.dto';

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

  @Post(':id/review')
  @ApiCreatedResponse({
    description: 'Review created successfully',
  })
  createReview(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
    @Body() createReviewDto?: CreateReviewDto,
  ) {
    return this.productsService.createReview(+id, user, createReviewDto);
  }

  @Public()
  @Get()
  findAll(@Query() queryProductsDto: QueryProductsDto) {
    return this.productsService.findAll(queryProductsDto);
  }

  @Public()
  @Get('ranking')
  rankinProduct(@Query() paginateProduct: GetAllQueryDto) {
    return this.productsService.rankinProduct(paginateProduct);
  }

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.WORKER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.findOneProduct(+id);
  }

  @Public()
  @Get(':id')
  seeOneProduct(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.seeOneProduct(+id);
  }

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.WORKER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.remove(+id);
  }
}
