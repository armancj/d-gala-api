import {
  IndicesIndexState,
  SearchHitsMetadata,
  UpdateResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { SearchServiceInsert } from '../search.service';

export interface SearchServiceInterface<T> {
  insertIndex(
    searchServiceInsert: SearchServiceInsert,
  ): Promise<WriteResponseBase>;

  updateIndex(
    index: string,
    id: string,
    body: T,
  ): Promise<UpdateResponse<unknown>>;

  searchIndex(index: string, body: T): Promise<SearchHitsMetadata<unknown>>;

  deleteIndex(index: string, id: string): Promise<WriteResponseBase>;

  getIndex(index: string): Promise<IndicesIndexState>;

  getIndexes(): Promise<string[]>;
}
