import { CacheModule, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [CacheModule.register()],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
