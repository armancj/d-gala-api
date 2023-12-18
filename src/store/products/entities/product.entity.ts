import { GenderType, Product, ProductStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class Products implements Product {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly name: string;
  readonly content: string;
  readonly priceCut: number;
  readonly price: number;
  readonly slug: string;
  readonly sizes: string[];
  readonly component: string[];
  readonly stars: number;
  readonly viewCount: number;
  readonly gender: GenderType;
  readonly tags: string[];
  readonly stock: number;
  readonly status: ProductStatus;
  readonly reviewsTotal: number;
  readonly userId: number;
  readonly colorDefault: string;
  readonly colors?: string[];
  readonly categoryName?: string;

  @Exclude()
  readonly deleted: boolean;

  constructor(product: Partial<Product>, colors?: string[]) {
    const { categories, ...rest } = product as any;
    Object.assign(this, rest);
    if (colors?.length > 0) this.colors = colors;
    if (categories?.length > 0) this.categoryName = categories[0]?.name;
  }

  static from(product: Partial<Product>, colors?: string[]): Product {
    return new Products(product, colors);
  }
}
