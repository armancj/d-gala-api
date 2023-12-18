import { Product } from '@prisma/client';
import { Products } from './product.entity';

export class ProductsAll {
  readonly products: Products[];

  constructor(products: Partial<Products[]>) {
    this.products = products.map((product) => Products.from(product));
  }

  static from(products: Partial<Product[]>): ProductsAll {
    return new ProductsAll(products);
  }
}
