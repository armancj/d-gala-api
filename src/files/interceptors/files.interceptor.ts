import { fileFilter, filename } from '../helpers';
import { diskStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

export const filesInterceptor = () =>
  FilesInterceptor('files', 6, {
    fileFilter,
    storage: diskStorage({
      filename,
    }),
  });

export const fileInterceptor = () =>
  FileInterceptor('file', {
    fileFilter,
    storage: diskStorage({
      filename,
    }),
  });
