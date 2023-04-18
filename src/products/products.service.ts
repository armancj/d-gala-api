import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllQueryDto, GetAllResponseDto } from '../common/dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Product, User } from '@prisma/client';
import { Prisma } from '.prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryName, ...rest } = createProductDto;
    const product: Prisma.ProductCreateInput = {
      categories: {
        connectOrCreate: {
          where: { name: createProductDto?.gender },
          create: { name: createProductDto.gender, generalCategory: false },
        },
      },
      user: { connect: { id: user.id } },
      ...rest,
    };

    return this.prisma.product
      .create({
        data: {
          ...product,
        },
      })
      .catch((err) =>
        HandlerError(
          err,
          `Category with id ${createProductDto.categoryName} not found`,
        ),
      );
  }

  async findAll(getAllQueryDto: QueryProductsDto) {
    const findCategory: GetAllResponseDto = {
      result: await this.prisma.product.findMany({
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

  findOneProduct(id: number) {
    return this.prisma.product
      .findFirstOrThrow({
        where: { id, deleted: false },
        include: {
          photo: { select: { id: true, name: true, url: true } },
          reviews: { select: { id: true, rating: true } },
        },
      })
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

  rankinProduct(paginateProduct: GetAllQueryDto) {
    return this.prisma.product.findMany({
      orderBy: { reviewsTotal: 'desc' },
      skip: paginateProduct.skip,
      take: paginateProduct.take,
    });
  }

  async seeOneProduct(id: number) {
    return await this.prisma.$transaction(async (prisma) => {
      prisma.product.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
        },
      });
      return this.findOneProduct(id);
    });
  }

  async createReview(
    id: number,
    user: User,
    createReviewDto?: CreateReviewDto,
  ) {
    await this.findOneProduct(id);
    return this.prisma.review.create({
      data: {
        product: { connect: { id } },
        user: { connect: { id: user.id } },
        ...createReviewDto,
      },
    });
  }
}
