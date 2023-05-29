import { Photo, Prisma } from '@prisma/client';

export interface PhotoIdInterface {
  productId?: number;
  profileId?: number;
}

export interface PhotoInterface {
  photo: Photo & {
    product: Prisma.ProductGetPayload<
      { product: boolean; profile: boolean }['product']
    > | null;
    profile: Prisma.ProfileGetPayload<
      { product: boolean; profile: boolean }['profile']
    > | null;
  };
}

export interface photoInput {
  minioData: { message: string; url: string };
  file: Express.Multer.File;
  photoId: PhotoIdInterface;
}
