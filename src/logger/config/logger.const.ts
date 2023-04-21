import { AbstractConfigSetLevels } from 'winston/lib/winston/config';

export const levels: AbstractConfigSetLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export enum LoggerEnum {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'log',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
