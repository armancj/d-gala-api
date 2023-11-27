import { Colors } from '@prisma/client';

export class Color implements Colors {
  readonly id: number;
  readonly hexadecimal: string;
  readonly productId: number;
  readonly url: string;
  readonly colorDefault: boolean;

  constructor(color: Colors) {
    Object.assign(this, color);
  }
}
