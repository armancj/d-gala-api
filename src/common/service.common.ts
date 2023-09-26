import { Injectable } from '@nestjs/common';
import * as pcg from 'generate-pincode';
import { format } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllQueryV2Dto } from './dto/get-all-query-v2.dto';
import { PrismaClient } from '@prisma/client';

export interface FindAllGeneric {
  tableName: keyof PrismaClient;
  getAllQueryDto: GetAllQueryV2Dto;
  filterBy?: any;
}

@Injectable()
export class CommonService {
  constructor(private readonly prisma: PrismaService) {}

  randomInt(): number {
    return Math.floor(Math.random() * (900000 - 100000 + 1)) + 100000;
  }

  setExpires(time: number): number {
    return Date.now() + time;
  }

  generateFiveDigitsRandom(): number {
    const number = Math.floor(Math.random() * 100000);
    if (number >= 10000) {
      return number;
    } else {
      return this.generateFiveDigitsRandom();
    }
  }

  generateRandomHash(): string {
    return (
      Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2)
    );
  }

  roundDecimals(num: number, decimals: number): number {
    const numeroRegexp = new RegExp('\\d\\.(\\d){' + decimals + ',}');
    if (numeroRegexp.test(num.toString())) {
      return Number(num.toFixed(decimals));
    } else {
      return Number(num.toFixed(decimals)) === 0 ? 0 : num;
    }
  }

  generatePin(digits: number): string {
    return pcg(digits);
  }
  getInString(strings: string[]) {
    let cad = '(';
    strings.forEach((v, i) => {
      if (i == strings.length - 1) cad += `'${v}')`;
      else cad += `'${v}',`;
    });
    return cad;
  }

  betweenDates(from: Date | string, to: Date | string) {
    return Between(
      format(
        typeof from === 'string' ? new Date(from) : from,
        'YYYY-MM-DD HH:MM:SS',
      ),
      format(typeof to === 'string' ? new Date(to) : to, 'YYYY-MM-DD HH:MM:SS'),
    );
  }

  async findAll(params: FindAllGeneric) {
    const { tableName, filterBy, getAllQueryDto } = params;
    const { page, take, sortBy, sortOrder, searchBy, fromDate, toDate } =
      getAllQueryDto;
    const skip = (page - 1) * take;

    console.log(typeof this.prisma[tableName]);
    const where: any = {};

    if (filterBy) {
      Object.entries(filterBy).forEach(([key, value]) => {
        where[key] = value;
      });
    }

    if (searchBy && where?.name) {
      where.name = { contains: searchBy };
    }

    if ((fromDate || toDate) && where?.createdAt) {
      where.createdAt = {
        ...(fromDate && {
          gte: format(new Date(fromDate), 'yyyy-MM-dd HH:mm:ss'),
        }),
        ...(toDate && { lte: format(new Date(toDate), 'yyyy-MM-dd HH:mm:ss') }),
      };
    }

    const [result, count] = await Promise.all([
      (this.prisma[tableName] as any).findMany({
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        where,
      }),
      (this.prisma[tableName] as any).count({ where }),
    ]);

    const prevPage = page > 1 ? page - 1 : null;
    const totalPage = Math.ceil(count / take);
    const nextPage = page < totalPage ? page + 1 : null;

    return { result, prevPage, page, nextPage, totalPage, count };
  }
}
function Between(arg0: any, arg1: any) {
  throw new Error('Function not implemented.');
}
