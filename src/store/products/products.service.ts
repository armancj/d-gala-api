import { Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductsDto,
  CreateReviewDto,
} from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { HandlerError } from '../../common/utils/handler-error';
import { GetAllQueryDto, GetAllResponseDto } from '../../common/dto';
import { Product, User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { stringReplaceUnderscore } from '../../common/utils/check-slug-insert.function';
import {ProductInput} from "./interface/product-input.interface";


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { categoryId, ...rest } = createProductDto;
    const product: Prisma.ProductCreateInput = this.createProductInput({
      categoryId,
      user,
      rest,
    });
    product.slug = this.getSlug(rest.name, rest?.slug);
    return this.prisma.product
      .create({
        data: product,
      })
      .catch((err) =>
        HandlerError(err, `Category with id ${categoryId} not found`),
      );
  }

  private createProductInput(params: ProductInput): Prisma.ProductCreateInput {
    const { user, rest, categoryId } = params;
    const categories: Prisma.CategoryCreateNestedManyWithoutProductsInput = {};
    if (categoryId) categories.connect = { id: categoryId };
    return {
      categories,
      user: { connect: { id: user.id } },
      ...rest,
    } as Prisma.ProductCreateInput;
  }

  private getSlug(name: string, slug?: string) {
    const editSlug = slug ? slug : name;
    return stringReplaceUnderscore(editSlug);
  }

  async findAllProduct(
    getAllQueryDto: QueryProductsDto,
  ): Promise<GetAllResponseDto> {
    const result = await this.prisma.product.findMany({
      where: {
        deleted: false,
        gender: getAllQueryDto.gender,
        status: getAllQueryDto.status,
      },
      include: {
        photo: { select: { id: true, name: true, url: true }, take: 1 },
        reviews: { select: { id: true, rating: true } },
      },
      orderBy: getAllQueryDto.orderBy,
      skip: getAllQueryDto.skip,
      take: getAllQueryDto.take,
    });
    const total = await this.prisma.product.count({
      where: { deleted: false },
    });
    const count = result.length;

    return { result, count, total };
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

  rankinProduct(paginateProduct: GetAllQueryDto): Promise<GetAllResponseDto> {
    return this.findAllProduct({
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
