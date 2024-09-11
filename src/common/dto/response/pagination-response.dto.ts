import { ApiProperty } from '@nestjs/swagger';

class PaginationLinksResponseDto {
  @ApiProperty({
    description: 'Link to the first page',
    example: '/api/resource?page=1&limit=10',
  })
  first: string;

  @ApiProperty({
    description: 'Link to the previous page',
    example: '/api/resource?page=2&limit=10',

    nullable: true,
  })
  prev: string | null;

  @ApiProperty({
    description: 'Link to the next page',
    nullable: true,
    example: '/api/resource?page=4&limit=10',
  })
  next: string | null;

  @ApiProperty({
    description: 'Link to the last page',
    example: '/api/resource?page=10&limit=10',
  })
  last: string;
}

export class PaginationMetaResponseDto {
  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;

  @ApiProperty({
    type: PaginationLinksResponseDto,
    description: 'Links for pagination navigation',
  })
  links: PaginationLinksResponseDto;
}

export class PaginationResponseDto<T> {
  @ApiProperty({
    isArray: true,
    type: 'generic',
    description: 'Array of data items',
  })
  data: T[];

  @ApiProperty({
    type: PaginationMetaResponseDto,
    description: 'Metadata related to pagination',
  })
  meta: PaginationMetaResponseDto;

  constructor(
    data: T[],
    total: number,
    currentPage: number,
    itemsPerPage: number,
    basePath: string,
  ) {
    this.data = data;
    const totalPages = Math.ceil(total / itemsPerPage);

    this.meta = {
      total,
      currentPage,
      itemsPerPage,
      totalPages,
      links: {
        first: this.buildLink(basePath, 1, itemsPerPage),
        prev:
          currentPage > 1
            ? this.buildLink(basePath, currentPage - 1, itemsPerPage)
            : null,
        next:
          currentPage < totalPages
            ? this.buildLink(basePath, currentPage + 1, itemsPerPage)
            : null,
        last: this.buildLink(basePath, totalPages, itemsPerPage),
      },
    };
  }

  private buildLink(basePath: string, page: number, limit: number): string {
    return `/api/${basePath}?page=${page}&limit=${limit}`;
  }
}
