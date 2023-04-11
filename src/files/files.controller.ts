import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Res,
  UseFilters,
  UploadedFiles,
  StreamableFile,
  ParseIntPipe,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  fileInterceptor,
  filesInterceptor,
} from './interceptors/files.interceptor';
import { FilesUploadDto } from './dto/file-upload.dto';
import { Public } from '../authentication/decorator';
import { FilesFilter } from './filters/files.filter';

@ApiTags('Files - Download and Upload')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Get(':fileName')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    const file = await this.filesService.downloadFile(fileName);
    res.set({
      'Content-Disposition': `attachment; filename=${fileName}`,
    });
    return new StreamableFile(file);
  }

  @Public()
  @Post('upload/profileId')
  @UseInterceptors(fileInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FilesUploadDto,
  })
  async uploadFile(
    @Param('profileId', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('make sure that the file has been image');
    return await this.filesService.uploadFileToProfile(file, productId);
  }

  @Public()
  @Post('uploads/productId')
  @UseFilters(new FilesFilter())
  @UseInterceptors(filesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FilesUploadDto,
  })
  async uploadsFile(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.filesService.uploadsFileToProduct(files, productId);
  }
}
