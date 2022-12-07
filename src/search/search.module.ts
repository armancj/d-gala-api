import { Global, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch/dist/interfaces/elasticsearch-module-options.interface';
import { SearchEnvEnum } from './config/search-env.enum';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<ElasticsearchModuleOptions>(SearchEnvEnum.APP_CONFIG_SEARCH),
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
