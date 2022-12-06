import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsSearchService } from './posts-search/posts-search.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
