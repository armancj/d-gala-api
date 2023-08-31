import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchAndFilterDto } from './dto/filter-by-color.dto';
import { CommonService } from '../../common/service.common';
import { prismaTable } from '../../config/app.constant';
import { ProductsService } from '../products/products.service';
import { id } from 'date-fns/locale';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commonService: CommonService,
    private readonly productsService: ProductsService,
  ) {}

  async create(createColorDto: CreateColorDto) {
    const { productId, hexadecimal } = createColorDto;
    const product = await this.productsService.findOneProduct(productId);
    if (product.colorDefault === 'updated_color')
      await this.prisma.product.update({
        where: { id: productId },
        data: { colorDefault: hexadecimal },
      });
    return this.prisma.colors
      .create({ data: createColorDto })
      .catch(async (err) => {
        console.log(err);
        if (product)
          await this.prisma.product.update({
            where: { id: productId },
            data: { colorDefault: product.colorDefault },
          });
      });
  }

  async findAll(searchAndFilterDto: SearchAndFilterDto) {
    const {
      page,
      take,
      searchBy,
      sortBy,
      sortOrder,
      toDate,
      fromDate,
      ...filterBy
    } = searchAndFilterDto;

    return this.commonService.findAll({
      tableName: prismaTable.colors,
      getAllQueryDto: {
        page,
        take,
        searchBy,
        sortBy,
        sortOrder,
        toDate,
        fromDate,
      },
      filterBy,
    });
  }

  findOne(id: number) {
    return this.prisma.colors.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateColorDto: UpdateColorDto) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }
}
