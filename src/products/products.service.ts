import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllResponseDto } from '../common/dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Product, User } from '@prisma/client';
import { Prisma } from '.prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const product: Prisma.ProductCreateInput = {
      categories: {
        connectOrCreate: {
          where: { id: createProductDto.categoryId },
          create: { name: createProductDto.gender, generalCategory: false },
        },
      },
      content: createProductDto.content,
      gender: createProductDto.gender,
      items: undefined,
      name: createProductDto.name,
      photo: undefined,
      price: createProductDto.price,
      reviews: undefined,
      reviewsTotal: 0,
      sizes: undefined,
      slug: createProductDto.slug,
      start: 0,
      status: undefined,
      stock: 0,
      tags: undefined,
      updatedAt: undefined,
      viewCount: 0,
    };

    return this.prisma.product
      .create({
        data: {
          ...product,
          user: { connect: { id: user.id } },
        },
      })
      .catch((err) =>
        HandlerError(
          err,
          `Category with id ${createProductDto.categoryId} not found`,
        ),
      );
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
}
