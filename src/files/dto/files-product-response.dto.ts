import { FileProduct, FilesProduct } from '../interface/file-product';

export class FilesProductResponseDto implements FilesProduct {
  data: FileProduct[];
}
