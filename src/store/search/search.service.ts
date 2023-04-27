import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SearchServiceInterface } from './interface/search.service.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch/dist/elasticsearch.service';
import { BulkRequest } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService implements SearchServiceInterface<any> {
  private logger: Logger = new Logger(SearchService.name);
  constructor(private readonly searchService: ElasticsearchService) {}

  async deleteDocument(indexData: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  deleteIndex(indexData: any): Promise<any> {
    return Promise.resolve(undefined);
  }

  async insertIndex(bulkData: any): Promise<any> {
    const bulk = [];
    bulk.push({
      index: {
        _index: `${bulkData.constructor.name.toLocaleLowerCase()}`,
        _id: bulkData?.data.id,
      },
    });
    bulk.push(bulkData.data);
    const productIndex: BulkRequest<typeof bulk> = {
      index: ` ${bulkData.constructor.name.toLocaleLowerCase()}`,
      operations: bulk,
    };
    return await this.searchService.bulk(productIndex).catch((err) => {
      this.logger.error(err);
      throw new HttpException(
        err,
        err.status | HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async searchIndex(searchData: any): Promise<any> {
    return await this.searchService.search(searchData).catch((err) => {
      this.logger.error(err);
      throw new HttpException(
        err,
        err.status | HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  updateIndex(updateData: any): Promise<any> {
    return Promise.resolve(undefined);
  }
}
