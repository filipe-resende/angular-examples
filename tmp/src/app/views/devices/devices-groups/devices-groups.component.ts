/* eslint-disable no-underscore-dangle */
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocumentType } from 'src/app/core/constants/document-type.const';
import { Member } from 'src/app/model/device-group-management/member-interface';
import { ManagerDeviceGroup } from 'src/app/model/manager-device-group-interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupManagementService } from 'src/app/services/factories/group-management.service';
import { MemberTypeConst } from 'src/app/shared/constantes/member-type.const';
import { DocumentOption } from 'src/app/shared/interfaces/documents-type-interface';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';

@Component({
  selector: 'app-devices-groups',
  templateUrl: './devices-groups.component.html',
  styleUrls: ['./devices-groups.component.scss'],
})
export class DevicesGroupsComponent implements OnInit {
  public displayedColumns: string[] = [
    'edition',
    'groupName',
    'createdAt',
    'groupManagerEmail',
    'memberCount',
    'deviceCount',
  ];

  public managerPlaceholder = '';

  public groupPlaceholder = '';

  public selectedType = '';

  public searchManager = '';

  public searchGroup = '';

  public data = new MatTableDataSource<ManagerDeviceGroup>([]);

  public hasSecurityAnalistOrAdministratorProfile: boolean;

  public userisInGroup: boolean;

  public spinner = false;

  public userInfo: IUserInfoWithRole;

  public userGroupsInfo: Member[] = [];

  private listOfGroupIds: string[] = [];

  public typeOptions: DocumentOption[] = [
    { name: 'Name', value: 'Nome' },
    { name: 'CPF', value: 'CPF' },
    { name: 'IAMID', value: 'IAMID' },
    { name: 'PASSPORT', value: 'Passaporte' },
    { name: 'EMAIL', value: 'Email' },
  ];

  public paginatorShow = false;

  public routeEditionGroup = '/groups/edit-group';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private liveAnnouncer: LiveAnnouncer,
    private groupManagementService: GroupManagementService,
    private authService: AuthService,
  ) {
    this.authService.userInfo$.subscribe(user => {
      this.userInfo = user;
    });
    this.hasSecurityAnalistOrAdministratorProfile = this.authService.isUserAllowedToEditDevicesGroups();

    if (!this.hasSecurityAnalistOrAdministratorProfile) {
      this.getUserGroupsByThingEmail();
    }
  }

  ngOnInit(): void {
    this.selectedType = 'Name';
    this.setPlaceholders();
    this.getDevicesGroupByManagerDocument();
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  public getByType(value: string): void {
    this.selectedType = value;
    this.searchManager = '';

    switch (this.selectedType) {
      case DocumentType.CPF.toUpperCase():
        this.setPlaceHolderToManager(DocumentType.CPF);
        break;
      case DocumentType.IAMID.toUpperCase():
        this.setPlaceHolderToManager(DocumentType.IAMID);
        break;
      case DocumentType.PASSPORT.toUpperCase():
        this.setPlaceHolderToManager(DocumentType.PASSPORT);
        break;
      case DocumentType.EMAIL.toUpperCase():
        this.setPlaceHolderToManager(DocumentType.EMAIL);
        break;
      default:
        this.setPlaceHolderToManager(DocumentType.Name);
        break;
    }
  }

  public onSubmit(): void {
    if (this.searchGroup) {
      this.spinner = true;
      this.groupManagementService
        .getDevicesGroupsByGroupName(this.searchGroup)
        .subscribe(result => this.generateTable(result));
    } else {
      this.getDevicesGroupByManagerDocument();
    }
  }

  public clearFields(): void {
    this.data = new MatTableDataSource<ManagerDeviceGroup>([]);
    this.selectedType = 'Name';
    this.searchManager = '';
    this.searchGroup = '';
    this.setPlaceholders();
    this.onSubmit();
  }

  private setPlaceholders(): void {
    this.setPlaceHolderToManager(DocumentType.Name);
    this.setPlaceholderToGroup();
  }

  private setPlaceHolderToManager(key: string): void {
    this.managerPlaceholder = this.translate.instant(
      `DEVICES_GROUP.PLACEHOLDER.${key}`,
    );
  }

  private setPlaceholderToGroup(): void {
    this.groupPlaceholder = this.translate.instant(
      'DEVICES_GROUP.PLACEHOLDER.GROUPS',
    );
  }

  private getDevicesGroupByManagerDocument(): void {
    this.spinner = true;
    this.groupManagementService
      .getDevicesGroupsByManagerDocument(this.searchManager, this.selectedType)
      .subscribe(result => this.generateTable(result));
  }

  private getUserGroupsByThingEmail(): void {
    this.groupManagementService
      .GetInfoUserByThingEmail(this.userInfo.mail)
      .subscribe(memberInfo => {
        this.userGroupsInfo = memberInfo.filter(
          e =>
            e.memberType === MemberTypeConst.FocalPoint ||
            e.memberType === MemberTypeConst.Manager,
        );
      });
  }

  private generateTable(body: ManagerDeviceGroup[]): void {
    if (!this.hasSecurityAnalistOrAdministratorProfile) {
      this.userGroupsInfo.forEach(groupInfo => {
        body
          .filter(b => b.groupId === groupInfo.groupId)
          .forEach(group => {
            group.canEdit = true;
            this.listOfGroupIds.push(group.groupId);
          });
      });

      const groupsFilteredByUserEmail = body
        .filter(g => g.creatorManagerEmail === this.userInfo.mail)
        .map(group => {
          group.canEdit = true;
          return group.groupId;
        });

      const fullListOfGroupsId = this.listOfGroupIds.concat(
        groupsFilteredByUserEmail,
      );

      const groupsIdListForStorage = [...new Set(fullListOfGroupsId)];

      localStorage.setItem(
        'groupsIdList',
        JSON.stringify(groupsIdListForStorage),
      );
    }

    this.setManagerEmail(body);

    this.paginatorShow = true;
    this.data = new MatTableDataSource<ManagerDeviceGroup>(body);
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
    this.paginatorTextCrtl();
    this.spinner = false;
  }

  private setManagerEmail(managerDeviceGroup: ManagerDeviceGroup[]) {
    managerDeviceGroup.forEach(group => {
      if (
        group.creatorManagerEmail === group.groupManagerEmail ||
        group.groupManagerEmail === ''
      ) {
        group.groupManagerEmail = group.creatorManagerEmail;
      }
    });
  }

  public changeDateToGMT(date: string): string {
    const convertToUtc = `${date}Z`;
    const utc = new Date(convertToUtc);
    return utc.toLocaleString();
  }

  public navigatorPageEdit(element: any): void {
    this.router.navigate([this.routeEditionGroup], { state: element });
  }

  public paginatorTextCrtl(): void {
    this.paginator._intl.itemsPerPageLabel = this.translate.instant(
      'PAGINATOR.ITEM_PER_PAGE',
    );
    this.paginator._intl.firstPageLabel = this.translate.instant(
      'PAGINATOR.FIRST_PAGE',
    );
    this.paginator._intl.lastPageLabel = this.translate.instant(
      'PAGINATOR.LAST_PAGE',
    );
    this.paginator._intl.nextPageLabel = this.translate.instant(
      'PAGINATOR.NEXT_PAGE',
    );
    this.paginator._intl.previousPageLabel = this.translate.instant(
      'PAGINATOR.PREVIOUS_PAGE',
    );
  }
}
