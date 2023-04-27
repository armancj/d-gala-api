import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from '@prisma/client';
import { IPostSearchResult } from '../interface/i-post-search-result.interface';
import { IPostSearchBody } from '../interface/i-post-search-body.interface';

@Injectable()
export class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.elasticsearchService.index<IPostSearchResult, IPostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.published,
        authorId: post.authorId,
      },
    });
  }

  async search(text: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { body } = await this.elasticsearchService.search<IPostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(postId: number) {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async update(post: Post) {
    const newBody: IPostSearchBody = {
      published: post.published,
      id: post.id,
      title: post.title,
      authorId: post.authorId,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          params: script,
        },
      },
    });
  }
}
