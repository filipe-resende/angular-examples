import { Roles } from '../shared/enums/iam.enums';

export interface BatchItem {
  id: number;
  name: string;
  route: string;
  roles?: Roles[];
  show?: boolean;
  menu?: BatchItem[];
}
