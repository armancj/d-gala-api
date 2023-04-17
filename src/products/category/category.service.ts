import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { HandlerError } from '../../common/utils/handler-error';
import { GetAllQueryDto, GetAllResponseDto } from '../../common/dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    if (createCategoryDto.generalCategory === true)
      delete createCategoryDto?.parentId;

    await this.findExistsDuplicatedCategoryByName(
      createCategoryDto.name,
      createCategoryDto.generalCategory,
    );
    return this.prisma.category
      .create({
        data: { ...createCategoryDto },
      })
      .catch((err) =>
        HandlerError(
          err,
          `The category general parent id: ${createCategoryDto.parentId} is incorrect. Please select a other category id`,
        ),
      );
  }

  async findAllCategory(getAllQueryDto: GetAllQueryDto) {
    const findCategory: GetAllResponseDto = {
      result: await this.prisma.category.findMany(),
      total: await this.prisma.category.count(),
    };
    return findCategory;
  }

  findOne(id: number) {
    return this.prisma.category
      .findUniqueOrThrow({
        where: { id },
        include: { products: true },
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

  private async findExistsDuplicatedCategoryByName(
    name: string,
    generalCategory: boolean,
  ) {
    const categoryType =
      generalCategory === true ? 'general category' : 'id-category';

    await this.prisma.category
      .findFirst({ where: { name, generalCategory } })
      .then((category) => {
        if (category)
          throw new ConflictException(
            `The name: ${name} of ${categoryType} is duplicated`,
          );
      });
  }
}
