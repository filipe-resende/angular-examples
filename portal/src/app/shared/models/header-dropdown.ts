import { Role } from '../enums/role';
import { HeaderItem } from './header-item';

export interface HeaderDropdown {
  label: string;
  route: string;
  roles?: Role[];
  subMenus?: HeaderItem[];
}
