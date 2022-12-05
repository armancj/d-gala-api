import { DefaultValue } from '../enum/default-value.enum';

export class GetAllQueryDto {
  skip?: number = DefaultValue.Skip;
  take?: number = DefaultValue.Limit;
}
