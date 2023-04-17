import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Post, Comment } from '@prisma/client';
import { HandlerError } from '../common/utils/handler-error';
import { GetAllQueryDto, GetAllResponseDto } from '../common/dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  createPost(createPostDto: CreatePostDto) {
    const { content, ...rest } = createPostDto;
    const comments: Comment[] = content.map((c) => {
      return {
        content: c,
      } as Comment;
    });
    return this.createPosts({
      data: {
        ...(rest as unknown as Post),
        comments: {
          createMany: { data: comments },
        },
      },
      include: { comments: true },
    }).then(async (post) => {
      //await this.postsSearchService.indexPost(post);
      return post;
    });
  }

  async searchForPosts(text: string) {
    /*const results = await this.postsSearchService.search(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.posts({
      where: { id: { in: ids } },
    });*/
  }

  async getAllPosts(query: GetAllQueryDto) {
    return await this.posts({ ...query });
  }

  async getPostById(id: number) {
    return await this.postWhereUniqueOrThrow({ where: { id } });
  }

  replacePost(id: number, updatePostDto: UpdatePostDto) {
    return this.updatePosts({ where: { id }, data: updatePostDto }).then(
      async (values) => {
        //await this.postsSearchService.updateUser(values);
        return values;
      },
    );
  }

  deletePost(id: number) {
    return this.updatePosts({ where: { id }, data: { deleted: true } }).then(
      async (value) => {
        //await this.postsSearchService.removeUser(id);
        return value;
      },
    );
  }

  async postWhereUnique(
    params: Prisma.PostFindUniqueArgs,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique(params);
  }

  async postWhereUniqueOrThrow(
    params: Prisma.PostFindUniqueOrThrowArgs,
  ): Promise<Post> {
    const post = await this.prisma.post
      .findUniqueOrThrow(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      );
    return post as Post;
  }

  async posts(params: Prisma.PostFindManyArgs): Promise<GetAllResponseDto> {
    if (params?.take === -1) delete params.take;
    const data = (await this.prisma.post
      .findMany()
      .catch((err) => HandlerError(err))) as unknown as Post[];
    const total = await this.prisma.post.count({ where: { deleted: false } });
    const count = data.length;
    return { result: data, count, total };
  }

  async createPosts(params: Prisma.PostCreateArgs): Promise<Post> {
    return (await this.prisma.post
      .create(params)
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      )) as unknown as Promise<Post>;
  }

  async updatePosts(params: Prisma.UserUpdateArgs): Promise<Post> {
    return (await this.prisma.user
      .update(params)
      .catch((err) =>
        HandlerError(err, `Email. username or Phone is duplicated`),
      )) as unknown as Promise<Post>;
  }

  async deletePosts(params: Prisma.UserDeleteArgs): Promise<Post> {
    return this.prisma.user
      .delete(params)
      .catch((err) =>
        HandlerError(
          err,
          `The user not found in the Site. Please select a other user id`,
        ),
      ) as unknown as Post;
  }
}
