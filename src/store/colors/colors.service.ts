import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchAndFilterDto } from './dto/filter-by-color.dto';
import { CommonService } from '../../common/service.common';
import { prismaTable } from '../../config/app.constant';
import { ProductsService } from '../products/products.service';
import { HandlerError } from '../../common/utils/handler-error';
import { Colors, Prisma } from '@prisma/client';

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
    const newColor: Prisma.ColorsUncheckedCreateInput = { ...createColorDto };
    if (product.colorDefault === 'updated_color') {
      await this.checkColorDefault(productId, hexadecimal);
      newColor.colorDefault = true;
    }
    return this.prisma.colors
      .create({
        data: newColor,
      })
      .catch(async (err) => {
        if (product)
          await this.prisma.product.update({
            where: { id: productId },
            data: { colorDefault: product.colorDefault },
          });
        HandlerError(err, err?.message);
      });
  }

  private async checkColorDefault(productId: number, hexadecimal: string) {
    await this.prisma.product.update({
      where: { id: productId },
      data: { colorDefault: hexadecimal },
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

  async findOne(id: number) {
    return this.prisma.colors
      .findUniqueOrThrow({ where: { id } })
      .catch((err) => HandlerError(err, err?.message));
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Colors> {
    const color = await this.findOne(id);

    if (color.hexadecimal === updateColorDto?.hexadecimal) return color;

    if (color.colorDefault)
      await this.checkColorDefault(
        color.productId,
        updateColorDto?.hexadecimal,
      );

    const colorUpdated: Prisma.ColorsUpdateInput = { ...updateColorDto };

    if (color.url === 'updated_url')
      colorUpdated.url = (
        await this.prisma.photo.findFirst({
          where: { productId: color.productId, color: color.hexadecimal },
        })
      ).url;

    return this.prisma.colors.update({
      where: { id },
      data: colorUpdated,
    });
  }

  async remove(id: number) {
    const color = await this.findOne(id);
    if (color.colorDefault)
      await this.checkColorDefault(color.productId, 'updated_color');
    return this.prisma.colors.delete({ where: { id } });
  }
}
