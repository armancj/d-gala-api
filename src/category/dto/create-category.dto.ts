interface ProductInterface {

}

export class CreateCategoryDto {
    name: string;
    parentId: number;
    productID:   ProductInterface[];
}
