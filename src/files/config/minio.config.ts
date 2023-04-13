import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('minio', () => {
  return {
    endPoint: `${process.env.MINIO_ENDPOINT}`,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.STATE === 'prod',
    accessKey: `${process.env.MINIO_ROOT_USER}`,
    secretKey: `${process.env.MINIO_ROOT_PASSWORD}`,
  };
});
