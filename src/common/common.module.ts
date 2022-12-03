import { Global, Module } from '@nestjs/common';
import { CommonService } from './service.common';
@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
