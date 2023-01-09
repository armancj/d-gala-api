import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class BrandsService {


  constructor( private prisma: PrismaService) {
  }

  create(createBrandDto: CreateBrandDto) {
    return ;
  }

  findAllBrands() {
    return `This action returns all brands`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
