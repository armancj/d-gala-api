import {
  ElasticsearchModuleOptions,
  ElasticsearchOptionsFactory,
} from '@nestjs/elasticsearch/dist/interfaces/elasticsearch-module-options.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { SearchEnvEnum } from './search-env.enum';

@Injectable()
export class ElasticSearchConfig implements ElasticsearchOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createElasticsearchOptions():
    | Promise<ElasticsearchModuleOptions>
    | ElasticsearchModuleOptions {
    return {
      node: this.configService.get<string>(SearchEnvEnum.NODE),
      name: this.configService.get<string>(SearchEnvEnum.NAME),
      auth: {
        username: this.configService.get<string>(SearchEnvEnum.USERNAME),
        password: this.configService.get<string>(SearchEnvEnum.PASSWORD),
      },
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: true,
    };
  }
}
