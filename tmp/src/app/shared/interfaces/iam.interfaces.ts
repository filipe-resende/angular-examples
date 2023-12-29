import { Roles } from '../enums/iam.enums';

export interface IUserInfo {
  mail: string;
  UserFullName: string;
  FirstName: string;
  groupMembership: string[];
  /**
   * User's C0 (IAM Id)
   */
  cn: string;
}
export interface IUserInfoWithRole extends IUserInfo {
  role: Roles;
}
export interface IUserInfoIamResponse {
  info: IUserInfo;
}
