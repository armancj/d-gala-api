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

  @Exclude()
  readonly deleted: boolean;

  constructor(product: Partial<Product>, colors: string[]) {
    Object.assign(this, product);
    this.colors = colors;
  }

  static from(product: Partial<Product>, colors: string[]): Product {
    return new Products(product, colors);
  }
}
