import { GroupMembers } from 'src/app/model/group-members';

export interface GroupInfo {
  deviceCount: number;
  memberCount: number;
  memberList: GroupMembers[];
}
