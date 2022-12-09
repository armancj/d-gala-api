import { Global, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch/dist/interfaces/elasticsearch-module-options.interface';
import { SearchEnvEnum } from './config/search-env.enum';
import { SearchController } from './search.controller';

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
  exports: [],
})
export class SearchModule {}
