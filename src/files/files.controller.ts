import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  ApiCreatedResponse,
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
import { Auth, GetUser, Public } from '../auth/decorator';
import { EnumUserRole } from '../user/enum/user-role.enum';
import { User } from '@prisma/client';
import { ExcludeInterceptor } from './decorators/exclude-interceptor.decorator';
import { ColorFilterDto } from '../common/dto';
import { FilesProductResponseDto } from './dto/files-product-response.dto';
import { ColorsService } from '../store/colors/colors.service';

@ApiTags('Files - Download and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly colorsService: ColorsService,
  ) {}

  @Public()
  @ExcludeInterceptor()
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

  @Post('uploads/photo/:productId')
  @UseFilters(new FilesFilter())
  @ApiCreatedResponse({
    description: 'Uploading photo product',
    type: FilesProductResponseDto,
  })
  @UseInterceptors(filesInterceptor())
  @Auth(EnumUserRole.WORKER, EnumUserRole.ADMIN, EnumUserRole.SUADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Images of Products',
    type: FilesUploadDto,
  })
  async uploadsFile(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() color: ColorFilterDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    const data = await this.filesService.uploadsFileToProduct(
      files,
      productId,
      color?.hexadecimal,
    );

    if (color?.hexadecimal)
      await this.colorsService.updateByColorAndProductId(
        productId,
        color.hexadecimal,
      );

    return data;
  }

  @Post('uploads/color/:colorId')
  @UseFilters(new FilesFilter())
  @UseInterceptors(filesInterceptor())
  @Auth(EnumUserRole.WORKER, EnumUserRole.ADMIN, EnumUserRole.SUADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Images of Colors',
    type: FilesUploadDto,
  })
  async uploadsFileColors(
    @Param('colorId', ParseIntPipe) colorId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('here');
    return await this.filesService.uploadsFileToColors(files, colorId);
  }

  @Auth(EnumUserRole.WORKER, EnumUserRole.ADMIN, EnumUserRole.SUADMIN)
  @Patch('changeColor/:id')
  async changeColorPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() colorFilterDto: ColorFilterDto,
  ) {
    return this.filesService.updateColorPhotoFile(
      id,
      colorFilterDto?.hexadecimal,
    );
  }

  @Delete('delete/photo/:fileName')
  @ApiBearerAuth()
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
