import { registerAs } from '@nestjs/config';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch/dist/interfaces/elasticsearch-module-options.interface';
export default registerAs('search', () => {
  const elasticSearch: ElasticsearchModuleOptions = {
    node: process.env.ELASTIC_SEARCH_NODE,
    name: process.env.ELASTIC_SEARCH_NAME,
    auth: {
      username: process.env.ELASTIC_SEARCH_USERNAME,
      password: process.env.ELASTIC_SEARCH_PASSWORD,
    },
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true,
  };
  return elasticSearch;
});
