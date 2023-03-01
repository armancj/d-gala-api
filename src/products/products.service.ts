import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllQueryDto, GetAllResponseDto } from '../common/dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.findOneProductName(createProductDto.name);
    return this.prisma.product
      .create({ data: { ...createProductDto } })
      .catch((err) =>
        HandlerError(
          err,
          `The category general parent id: ${createProductDto.name} is incorrect. Please select a other category id`,
        ),
      );
  }

  async findAll(getAllQueryDto: GetAllQueryDto) {
    const findCategory: GetAllResponseDto = {
      data: await this.prisma.product.findMany({
        where: { deleted: false },
        skip: getAllQueryDto.skip,
        take: getAllQueryDto.take,
      }),
      total: await this.prisma.product.count({ where: { deleted: false } }),
    };
    return findCategory;
  }

  findOne(id: number) {
    return this.prisma.product
      .findFirstOrThrow({ where: { id, deleted: false } })
      .catch((err) =>
        HandlerError(
          err,
          `The product id: ${id} is incorrect or not exists. Please select a other product id`,
        ),
      );
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product
      .update({
        where: { id },
        data: updateProductDto,
      })
      .catch((err) =>
        HandlerError(
          err,
          `The product id: ${id} is incorrect or not exists. Please select a other product id`,
        ),
      );
  }

  remove(id: number) {
    return this.prisma.product
      .update({
        where: { id },
        data: { deleted: true },
      })
      .catch((err) =>
        HandlerError(
          err,
          `The product id: ${id} is incorrect or not exists. Please select a other product id`,
        ),
      );
  }

  private async findOneProductName(name: string): Promise<void> {
    const productFounds = await this.prisma.product.findFirst({
      where: { name, deleted: false },
    });
    if (productFounds) throw new ConflictException('The product is duplicated');
  }
}
