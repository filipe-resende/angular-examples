import { Roles } from '../shared/enums/iam.enums';
import {
  IUserInfoIamResponse,
  IUserInfoWithRole,
} from '../shared/interfaces/iam.interfaces';

export const userInfoIamResponseMock: IUserInfoIamResponse = {
  info: {
    FirstName: 'First Name',
    UserFullName: 'User Full Name',
    cn: 'C0',
    groupMembership: ['cn=Admin,ou=TMP,ou=Groups,o=vale'],
    mail: 'C0@vale.com',
  },
};
export const userInfoWithRoleMock: IUserInfoWithRole = {
  ...userInfoIamResponseMock.info,
  role: Roles.Administrador,
};
