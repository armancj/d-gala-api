import { ApiProperty } from '@nestjs/swagger';

export class GetAllQueryResponseDto {
  static createGenericDto(dto: any, resourceName?: string): any {
    class GetOneResponseDto {
      @ApiProperty({ type: dto, required: false })
      filterBy?: typeof dto;
    }

    Object.defineProperty(GetOneResponseDto, 'name', {
      writable: false,
      value: `${resourceName}ResponseDto`,
    });

    return GetOneResponseDto;
  }
}
