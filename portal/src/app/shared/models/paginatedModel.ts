export interface PaginatedModel<T> {
  totalCount: number;
  data: T;
  page?: number;
  perPage?: number;
}
