import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllResponseDto } from '../common/dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Product, User } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: User) {
    await this.findOneProductName(createProductDto.name);
    return this.prisma.product.create({
      data: { ...createProductDto } as unknown as Product,
    });
  }

  async findAll(getAllQueryDto: QueryProductsDto) {
    const findCategory: GetAllResponseDto = {
      data: await this.prisma.product.findMany({
        where: {
          deleted: false,
          gender: getAllQueryDto.gender,
          status: getAllQueryDto.status,
        },
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
        data: updateProductDto as unknown as Product,
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
