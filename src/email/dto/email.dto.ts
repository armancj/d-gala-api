export class EmailDto {
  to?: string;
  subject?: string;
  template?: string;
  context?: {
    body?: string;
    link?: string;
  };
}
