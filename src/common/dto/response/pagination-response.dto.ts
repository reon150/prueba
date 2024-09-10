export class PaginationResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    links: {
      first: string;
      prev: string | null;
      next: string | null;
      last: string;
    };
  };

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
