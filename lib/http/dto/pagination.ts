export type PaginationDto = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponseDto<T> = {
  envios?: T[];
  items?: T[];
  pagination: PaginationDto;
};
