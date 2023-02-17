import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryData } from '../products/category/data/category.data';
import { HandlerError } from '../common/utils/handler-error';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async executeSeed() {
    await this.prisma.category.deleteMany({});
    await this.prisma.category
      .createMany({ data: CategoryData })
      .catch((err) => HandlerError(err));
    return 'Seed executed successfully';
  }
}
