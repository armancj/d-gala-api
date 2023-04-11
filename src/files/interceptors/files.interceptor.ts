import { fileFilter, filename } from '../helpers';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';

export const FileInterceptor = () =>
  FilesInterceptor('files', 6, {
    fileFilter,
    storage: diskStorage({
      //destination: './static/products',
      filename,
    }),
  });
