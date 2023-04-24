import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryData } from '../products/category/data/category.data';
import { HandlerError } from '../common/utils/handler-error';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configServices: ConfigService,
  ) {}

  async executeSeed() {
    await this.prisma.category.deleteMany({});
    await this.prisma.category
      .createMany({ data: CategoryData })
      .catch((err) => HandlerError(err));
    return 'Seed executed successfully';
  }
}
