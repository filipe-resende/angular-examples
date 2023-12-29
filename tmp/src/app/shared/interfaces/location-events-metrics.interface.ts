import { TotalOfCountByMiddleware } from './total-count-by-middleware.interface';

export interface LocationEvents {
  id: string;
  totalCount: number;
  totalCountByMiddlewares: TotalOfCountByMiddleware;
}
