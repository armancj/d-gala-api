import { SetMetadata } from '@nestjs/common';

export const IS_EXCLUDE_KEY = 'isExclude';
export const ExcludeInterceptor = () => SetMetadata(IS_EXCLUDE_KEY, true);
