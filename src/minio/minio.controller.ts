import { Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { MinioService } from './minio.service';
import { Auth } from './decorators/api-swagger-consumer.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Auth()
  @Post('createBucket')
  async createBucket(): Promise<any> {
    return this.minioService.create();
  }

  @Auth()
  @Post('listBucket')
  async listBucket(): Promise<any> {
    return this.minioService.getBuckets();
  }

  @Auth()
  @Get('getFile/:fileName')
  async getFile(@Param('fileName') fileName: string, @Res() res) {
    const obj = await this.minioService.loadFile('blacklist/' + fileName);
    const buf = Buffer.from(obj.split('base64')[1], 'base64');
    let mimeType = obj.split(';')[0];
    mimeType = mimeType.split(':')[1];

    res.setHeader('Content-Length', buf.length);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    return res.status(HttpStatus.OK).send(buf);
  }
}
