import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Res,
  UseFilters, UploadedFiles,
} from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from './interceptors/files.interceptor';
import { FilesUploadDto } from './dto/file-upload.dto';
import { Public } from '../authentication/decorator';
import { FilesFilter } from './filters/files.filter';

@ApiTags('Files - Download and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServices: ConfigService,
  ) {}

  @Get(':fileName')
  getFile(@Res() res: Response, @Param('fileName') fileName: string) {
    res.sendFile(this.filesService.getStaticFile(fileName));
  }

  @Public()
  @Post('upload')
  @UseFilters(new FilesFilter())
  @UseInterceptors(FileInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FilesUploadDto,
  })
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.filesService.uploadFile(files);
  }
}
