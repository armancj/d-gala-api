import { Product } from '@prisma/client';

export class Products {
  private _product: Product;

  constructor(product: Product) {
    this._product = product;
  }

  get product(): Product {
    return this._product;
  }

  set product(value: Product) {
    this._product = value;
  }
}
