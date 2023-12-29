import { Role } from '../enums/role';

export interface HeaderItem {
  label: string;
  route: string;
  roles?: Role[];
  show?: boolean;
}
