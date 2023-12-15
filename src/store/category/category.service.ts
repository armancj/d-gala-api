import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { HandlerError } from '../../common/utils/handler-error';
import { GetAllQueryDto, GetAllResponseDto } from '../../common/dto';
import { UserPayload } from '../../user/interface/user-payload';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserPayload,
  ) {
    const { parentId, ...rest } = createCategoryDto;
    const categoryData: Prisma.CategoryCreateInput = {
      ...rest,
      createBy: { connect: { id: user.id } },
    };
    if (createCategoryDto.generalCategory === false) {
      categoryData.parent = {
        connect: {
          id: parentId,
        },
      };
    }
    await this.findExistsDuplicatedCategoryByName(
      createCategoryDto.name,
      createCategoryDto.generalCategory,
    );
    return this.prisma.category
      .create({
        data: categoryData,
      })
      .catch((err) => {
        HandlerError(
          err,
          `The category general parent id: ${createCategoryDto.parentId} is incorrect. Please select a other category id`,
        );
      });
  }

  async findAllCategory(
    getAllQueryDto: GetAllQueryDto,
  ): Promise<GetAllResponseDto> {
    const where: Prisma.CategoryWhereInput = {
      deleted: false,
      generalCategory: false,
    };
    const result = await this.prisma.category.findMany({
      ...getAllQueryDto,
      where,
    });
    const total = await this.prisma.category.count({
      where: { deleted: false },
    });
    const count = result.length;
    return { result, count, total };
  }

  async findOne(id: number) {
    return this.prisma.category
      .findUniqueOrThrow({
        where: { id },
        include: {
          products: { include: { photo: { select: { url: true } } } },
        },
      })
      .catch((err) =>
        HandlerError(
          err,
          `The category not found in the Site. Please select a other category id`,
        ),
      );
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
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
      generalCategory === true ? 'general categories' : 'id-categories';

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
