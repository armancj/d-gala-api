import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  SWAGGER_PREFIX: Joi.string().required(),
  GLOBAL_PREFIX: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_SECRET_REFRESH_KEY: Joi.string().required(),
  JWT_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_TOKEN_REFRESH_EXPIRATION_TIME: Joi.string().required(),
  ELASTIC_SEARCH_NODE: Joi.string().required(),
  ELASTIC_USERNAME: Joi.string().required(),
  ELASTIC_PASSWORD: Joi.string().required(),
  ELASTIC_SEARCH_NAME: Joi.string().required(),
  MINIO_ROOT_USER: Joi.string().required(),
  MINIO_ROOT_PASSWORD: Joi.string().required(),
  MINIO_BUCKET: Joi.string()
    .lowercase()
    .replace(/[^a-z]+/g, '')
    .required(),
});
