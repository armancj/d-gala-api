import {
  BadRequestException,
  Controller, Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { FilesService } from './files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  fileInterceptor,
  filesInterceptor,
} from './interceptors/files.interceptor';
import { FilesUploadDto, FileUploadDto } from './dto/file-upload.dto';
import { FilesFilter } from './filters/files.filter';
import { MinioPolicy } from './enum/minio.enum';
import { Auth, GetUser, Public } from '../authentication/decorator';
import { EnumUserRole } from '../user/enum/user-role.enum';
import { User } from '@prisma/client';

@ApiTags('Files - Download and Upload')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Get('download/photo/:fileName')
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

  @Auth(EnumUserRole.SUADMIN, EnumUserRole.ADMIN)
  @ApiQuery({ name: 'policyEnable', enum: MinioPolicy })
  @Post('access/policy')
  accessPolicy(
    @Query('policyEnable') policyEnable: MinioPolicy = MinioPolicy.public,
  ) {
    return this.filesService.changePolicy(policyEnable);
  }

  @Post('upload/photo/profile')
  @UseInterceptors(fileInterceptor())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image of User Profile',
    type: FileUploadDto,
  })
  async uploadFile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException('make sure that the file has been image');
    return await this.filesService.uploadFileToProfile(file, user.id);
  }

  @Public()
  @Post('uploads/photo/:productId')
  @UseFilters(new FilesFilter())
  @UseInterceptors(filesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Images of Products',
    type: FilesUploadDto,
  })
  async uploadsFile(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.filesService.uploadsFileToProduct(files, productId);
  }

  @Delete('delete/photo/:fileName')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'delete Image',
    type: FileUploadDto,
  })
  async deletePhoto(
    @GetUser() user: User,
    @Param('fileName') fileName: string,
  ) {
    return await this.filesService.deletePhotoByFilename(fileName, user);
  }
}
