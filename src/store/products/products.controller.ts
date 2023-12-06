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
import {
  CreateProductDto,
  QueryProductsDto,
  UpdateProductDto,
  CreateReviewDto,
} from './dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth, GetUser, Public } from '../../auth/decorator';
import { EnumUserRole } from '../../user/enum/user-role.enum';
import { User } from '@prisma/client';
import { ColorFilterDto } from '../../common/dto';

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
    return this.productsService.findAllProduct(queryProductsDto);
  }

  @Public()
  @Get('ranking')
  rankinProduct() {
    return this.productsService.rankinProduct();
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: string,
    @Query() color: ColorFilterDto,
  ) {
    return this.productsService.findOneProduct(+id, color?.hexadecimal);
  }

  @Public()
  @Get('seedOne/:id')
  seeOneProduct(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.seeOneProduct(+id);
  }

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN, EnumUserRole.WORKER)
  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.remove(+id);
  }
}
