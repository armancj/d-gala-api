export interface FilesProduct {
  data: FileProduct[];
}

export interface FileProduct {
  id: number;
  createdAt: Date;
  name: string;
  space: number;
  url: string;
  productId: number;
  profileId: null;
  updatedAt: Date;
  color: string;
}
