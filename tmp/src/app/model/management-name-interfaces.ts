export interface Management {
  id: string;
  code: number;
  description: string;
}

export interface ManagementNameResponse {
  skip: number;
  count: number;
  totalCount: number;
  management: Management[];
}
