import { PaginationResponseDto } from './pagination-response.dto';

describe('PaginationResponseDto', () => {
  const basePath = 'resource';
  const itemsPerPage = 10;

  it('should correctly initialize for first page with multiple pages', () => {
    const totalItems = 100;
    const currentPage = 1;

    const paginationDto = new PaginationResponseDto(
      [],
      totalItems,
      currentPage,
      itemsPerPage,
      basePath,
    );

    expect(paginationDto.data).toEqual([]);
    expect(paginationDto.meta.total).toBe(totalItems);
    expect(paginationDto.meta.currentPage).toBe(currentPage);
    expect(paginationDto.meta.itemsPerPage).toBe(itemsPerPage);
    expect(paginationDto.meta.totalPages).toBe(10);
    expect(paginationDto.meta.links.first).toEqual(
      '/api/resource?page=1&limit=10',
    );
    expect(paginationDto.meta.links.prev).toBeNull();
    expect(paginationDto.meta.links.next).toEqual(
      '/api/resource?page=2&limit=10',
    );
    expect(paginationDto.meta.links.last).toEqual(
      '/api/resource?page=10&limit=10',
    );
  });

  it('should correctly handle the last page', () => {
    const totalItems = 95;
    const currentPage = 10;

    const paginationDto = new PaginationResponseDto(
      [],
      totalItems,
      currentPage,
      itemsPerPage,
      basePath,
    );

    expect(paginationDto.meta.totalPages).toBe(10);
    expect(paginationDto.meta.links.first).toEqual(
      '/api/resource?page=1&limit=10',
    );
    expect(paginationDto.meta.links.prev).toEqual(
      '/api/resource?page=9&limit=10',
    );
    expect(paginationDto.meta.links.next).toBeNull();
    expect(paginationDto.meta.links.last).toEqual(
      '/api/resource?page=10&limit=10',
    );
  });

  it('should handle a single page scenario', () => {
    const totalItems = 5;
    const currentPage = 1;

    const paginationDto = new PaginationResponseDto(
      [],
      totalItems,
      currentPage,
      itemsPerPage,
      basePath,
    );

    expect(paginationDto.meta.totalPages).toBe(1);
    expect(paginationDto.meta.links.first).toEqual(
      '/api/resource?page=1&limit=10',
    );
    expect(paginationDto.meta.links.prev).toBeNull();
    expect(paginationDto.meta.links.next).toBeNull();
    expect(paginationDto.meta.links.last).toEqual(
      '/api/resource?page=1&limit=10',
    );
  });
});
