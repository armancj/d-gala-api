import { Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductsDto,
  CreateReviewDto,
} from './dto';
import { PrismaService } from '../../prisma/prisma.service';
import { HandlerError } from '../../common/utils/handler-error';
import { GetAllResponseDto } from '../../common/dto';
import { User, Prisma } from '@prisma/client';
import { stringReplaceUnderscore } from '../../common/utils/check-slug-insert.function';
import { ProductInput } from './interface/product-input.interface';
import { Products } from './entities/product.entity';
import { ProductsAll } from './entities/products.entity';

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
    select?: Prisma.ProductSelect,
  ): Promise<GetAllResponseDto> {
    const { search, orderBy, skip, take, status, gender, takeImage, colors } =
      getAllQueryDto;

    const where: Prisma.ProductWhereInput = {
      deleted: false,
      gender,
      status,
    };

    if (search) where.name = { contains: search, mode: 'insensitive' };

    const products = (await this.prisma.product.findMany({
      where,
      select: {
        id: true,
        ...this.selectProductInput(select),
        photo: { select: { id: true, name: true, url: true }, take: takeImage },
        reviews: { select: { id: true, rating: true } },
        colors,
        categories: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      orderBy,
    })) as unknown as Products[];
    const total = await this.prisma.product.count({
      where: { deleted: false },
    });
    const count = products.length;

    const result = ProductsAll.from(products).products;

    return { result, count, total };
  }

  async findOneProduct(id: number, hexadecimal?: string) {
    const colors = (
      await this.prisma.colors.findMany({
        where: { productId: id },
        select: { hexadecimal: true },
      })
    ).map((color) => {
      return color?.hexadecimal || null;
    });

    const result = await this.prisma.product
      .findFirstOrThrow({
        where: { id, deleted: false },
        include: {
          photo: {
            where: { color: { equals: hexadecimal } },
            select: { id: true, name: true, url: true, color: true },
          },
          reviews: { select: { id: true, rating: true } },
          categories: { select: { name: true } },
        },
      })
      .catch((err) =>
        HandlerError(
          err,
          `The product id: ${id} is incorrect or not exists. Please select a other product id`,
        ),
      );
    return Products.from(result, colors);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const { price, ...productData } = updateProductDto;
    const data: Prisma.ProductUncheckedUpdateInput = {
      ...productData,
      price,
    };
    const product = await this.findOneProduct(id);
    if (price && price !== product.price) data.priceCut = product.price;
    return this.prisma.product
      .update({
        where: { id },
        data,
      })
      .catch((err) => console.log(err));
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

  async rankinProduct(): Promise<GetAllResponseDto> {
    return this.findAllProduct(
      {
        orderBy: { reviewsTotal: 'desc' },
        colors: true,
        takeImage: 1,
        take: 10,
      },
      {
        component: true,
        tags: false,
        gender: false,
        stock: false,
        content: false,
        slug: false,
        sizes: false,
        stars: false,
        viewCount: false,
        //reviewsTotal: false,
      },
    );
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

  private selectProductInput(
    select?: Prisma.ProductSelect | null,
  ): Prisma.ProductSelect {
    const defaultSelect: Prisma.ProductSelect = {
      name: true,
      price: true,
      priceCut: true,
      content: true,
      component: false,
      gender: true,
      sizes: true,
      stock: true,
      slug: true,
      tags: true,
      stars: true,
      status: true,
      viewCount: true,
      reviewsTotal: true,
      _count: false,
      categories: false,
      items: false,
      deleted: false,
      user: false,
      userId: false,
      colorDefault: true,
    };
    return {
      ...defaultSelect,
      ...select,
    };
  }
}
