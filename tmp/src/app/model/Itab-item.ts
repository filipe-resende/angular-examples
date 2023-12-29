import { Roles } from '../shared/enums/iam.enums';

export interface ITabItem {
  id: number;
  route?: string;
  name: string;
  menus?: ITabItem[];
  roles?: Roles[];
  submenu?: ITabItem[];
}
