import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { HandlerError } from '../common/utils/handler-error';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category
      .create({
        data: createCategoryDto,
      })
      .catch((err) => HandlerError(err));
  }

  findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.prisma.category
      .findUniqueOrThrow({
        where: { id },
        include: { product: true },
      })
      .catch((err) =>
        HandlerError(
          err,
          `The category not found in the Site. Please select a other category id`,
        ),
      );
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category
      .update({
        where: { id },
        data: updateCategoryDto,
      })
      .catch((err) =>
        HandlerError(
          err,
          `The category not found in the Site. Please select a other category id`,
        ),
      );
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
