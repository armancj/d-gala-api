import { Global, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { SearchController } from './search.controller';
import { ElasticSearchConfig } from './config/elastic-search-config';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useClass: ElasticSearchConfig,
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [],
})
export class SearchModule {}
