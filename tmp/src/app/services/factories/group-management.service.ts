import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { ManagerDeviceGroup } from 'src/app/model/manager-device-group-interface';
import { Observable } from 'rxjs';
import { DocumentType } from 'src/app/core/constants/document-type.const';
import { GroupInfo } from 'src/app/model/group-info';
import { CreateMember } from 'src/app/model/device-group-management/create-member-interface';
import { CreateGroup } from 'src/app/model/device-group-management/create-group-interface';
import { Member } from 'src/app/model/device-group-management/member-interface';
import { UpdateGroup } from 'src/app/model/device-group-management/update-group-interface';
import { ExportDevicesInGroupInterface } from '../../model/device-group-management/export-devices-in-group-interface';

@Injectable({
  providedIn: 'root',
})
export class GroupManagementService {
  private readonly BFF_URL = `${environment.thingsManagementBffUrl}/group-management`;

  private headers = { Authorization: `Basic ${environment.Authorization()}` };

  constructor(private service: HttpClient) {}

  getDevicesGroupsByGroupName(
    groupName: string,
  ): Observable<ManagerDeviceGroup[]> {
    let params = new HttpParams();
    params = params.append('GroupName', groupName);

    return this.service
      .get<ManagerDeviceGroup[]>(`${this.BFF_URL}`, {
        params,
        headers: this.headers,
      })
      .pipe(take(1));
  }

  getDevicesGroupsByManagerDocument(
    managerDocument: string,
    documentType: string,
  ): Observable<ManagerDeviceGroup[]> {
    let params = new HttpParams();

    switch (documentType) {
      case DocumentType.CPF.toUpperCase():
        params = params.append('CPF', managerDocument);
        break;
      case DocumentType.PASSPORT.toUpperCase():
        params = params.append('Passport', managerDocument);
        break;
      case DocumentType.IAMID.toUpperCase():
        params = params.append('IAMID', managerDocument);
        break;
      case DocumentType.EMAIL.toUpperCase():
        params = params.append('Email', managerDocument);
        break;
      default:
        params = params.append('ManagerName', managerDocument);
        break;
    }

    return this.service
      .get<ManagerDeviceGroup[]>(`${this.BFF_URL}`, {
        params,
        headers: this.headers,
      })
      .pipe(take(1));
  }

  public GetInfoGroupById(groupId: string): Observable<GroupInfo> {
    return this.service
      .get<GroupInfo>(`${this.BFF_URL}/GetInfoGroupById?groupId=${groupId}`)
      .pipe(take(1));
  }

  public GetInfoUserByThingEmail(email: string): Observable<Member[]> {
    return this.service
      .get<Member[]>(`${this.BFF_URL}/GetMemberGroupsInfo?email=${email}`)
      .pipe(take(1));
  }

  public CreateMemberInGroup(
    createMemberRequest: CreateMember,
  ): Observable<void> {
    return this.service.post<void>(
      `${this.BFF_URL}/AddMemberToGroup`,
      createMemberRequest,
    );
  }

  public RemoveMemberFromGroup(
    groupId: string,
    thingId: string,
  ): Observable<void> {
    let params = new HttpParams();

    params = params.append('groupId', groupId);
    params = params.append('thingId', thingId);

    return this.service.delete<void>(`${this.BFF_URL}/DeleteMemberFromGroup`, {
      params,
    });
  }

  public ExportDevicesInGroup(
    exportDevicesInGroup: ExportDevicesInGroupInterface,
  ): Observable<void> {
    return this.service.post<void>(
      `${this.BFF_URL}/ExportDevicesInGroup`,
      exportDevicesInGroup,
    );
  }

  public CreateGroup(createGroupRequest: CreateGroup): Observable<void> {
    return this.service.post<void>(
      `${this.BFF_URL}/CreateGroup`,
      createGroupRequest,
    );
  }

  public UpdateGroup(updateGropRequest: UpdateGroup): Observable<void> {
    return this.service.patch<void>(
      `${this.BFF_URL}/UpdateGroup`,
      updateGropRequest,
    );
  }
}
