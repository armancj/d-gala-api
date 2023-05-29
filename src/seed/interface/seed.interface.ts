import { Prisma, Review } from '@prisma/client';

export interface SeedProduct extends Prisma.ProductCreateInput {
  categoryId: number;
  userId: number;
  photosName: string[];
}

export interface SeedData {
  products: SeedProduct[];
  users: Prisma.UserCreateManyInput[];
  profiles: Prisma.ProfileCreateManyInput[];
  categories: Prisma.CategoryCreateManyInput[];
  photos: Prisma.PhotoCreateManyInput[];

  review: Review[];
}

export interface Connect {
  connect: { id: number };
}

export interface updatePhotoInterface {
  url: string;
  id: number;
  space: number;
}