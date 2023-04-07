import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetAllQueryDto } from '../common/dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  getAllPosts(
    @Query() query: GetAllQueryDto,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.postsService.searchForPosts(search);
    }
    return this.postsService.getAllPosts(query);
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: string) {
    return this.postsService.getPostById(+id);
  }

  @Patch(':id')
  replacePost(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.replacePost(+id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: string) {
    return this.postsService.deletePost(+id);
  }
}
