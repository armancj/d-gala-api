import { Injectable, Logger } from '@nestjs/common';
import { SearchServiceInterface } from './interface/search.service.interface';
import { Products } from '../products/entities/product.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  IndicesIndexState,
  SearchHitsMetadata,
  UpdateResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { OnEvent } from '@nestjs/event-emitter';

export interface SearchServiceInsert {
  index: string;
  product: Products;
}

@Injectable()
export class SearchService implements SearchServiceInterface<Products> {
  private logger: Logger = new Logger(SearchService.name);
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async deleteIndex(index: string, id: string): Promise<WriteResponseBase> {
    return await this.elasticsearchService.delete({ index, id });
  }

  async getIndex(index: string): Promise<IndicesIndexState> {
    const { body } = await this.elasticsearchService.indices.get({
      index,
    });

    return body;
  }

  async getIndexes(): Promise<string[]> {
    const { body } = await this.elasticsearchService.indices.get({
      index: '_all',
    });

    return Object.keys(body);
  }

  @OnEvent('index.created', { async: true })
  async insertIndex(
    searchServiceInsert: SearchServiceInsert,
  ): Promise<WriteResponseBase> {
    const { index, product } = searchServiceInsert;
    const { id, ...rest } = product;

    return await this.elasticsearchService.index({
      index,
      id: id.toString(),
      ...rest,
    });
  }

  async searchIndex(
    index: string,
    product: Products,
  ): Promise<SearchHitsMetadata<unknown>> {
    const { id, sizes, tags, createdAt, updatedAt, component, ...rest } =
      product;

    const { hits } = await this.elasticsearchService.search({
      index,
      query: {
        match: {
          ...rest,
        },
      },
    });
    return hits;
  }

  async updateIndex(
    index: string,
    id: string,
    product: Omit<Partial<Products>, 'id'>,
  ): Promise<UpdateResponse<unknown>> {
    const { ...rest } = product;
    return await this.elasticsearchService.update({
      index,
      id,
      ...rest,
    });
  }
}
