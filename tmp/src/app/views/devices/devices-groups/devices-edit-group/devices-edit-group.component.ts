import { ActivatedRoute, Router } from '@angular/router';
import { GroupManagementService } from 'src/app/services/factories/group-management.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { GroupMembers } from 'src/app/model/group-members';
import { Devices } from 'src/app/model/devices-interfaces';
import {
  AssociatedThing,
  ThingWithSourceInfos,
} from 'src/app/model/things-interfaces';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import {
  MemberTypeEnum,
  MemberTypeNameEnum,
} from 'src/app/shared/enums/MemberType.enum';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DevicesService } from 'src/app/services/factories/devices.service';
import { DocumentType } from 'src/app/core/constants/document-type.const';
import { DocumentMDMType } from 'src/app/core/constants/document-mdm-type.const';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { CreateMember } from 'src/app/model/device-group-management/create-member-interface';
import { MemberType } from 'src/app/core/constants/memberType.const';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationRemoveMemberModalComponent } from 'src/app/components/confirmation-remove-member-modal/confirmation-remove-member-modal-component';
import {
  ExportationRecipientModalComponent,
  IExportationRecipientModalComponentData,
} from 'src/app/components/exportation-recipient-modal/exportation-recipient-modal.component';
import { ExportationDoneModalComponent } from 'src/app/components/exportation-done-modal/exportation-done-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExportDevicesInGroupInterface } from 'src/app/model/device-group-management/export-devices-in-group-interface';
import { ApplicationId } from 'src/app/core/constants/applicationsId.const';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { IEditGroupNameComponentData } from 'src/app/model/device-group-management/edit-group-name-component-interface';
import { ThingGroupAssociationComponent } from './thing-group-association/thing-group-association.component';
import { EditGroupNameComponent } from './edit-group-name/edit-group-name.component';

@Component({
  selector: 'app-devices-edit-group',
  templateUrl: './devices-edit-group.component.html',
  styleUrls: ['./devices-edit-group.component.scss'],
})
export class DevicesEditGroupComponent implements OnInit {
  public displayedColumns: string[] = ['Delete', 'memberType', 'name', 'email'];

  public dataMembers = new MatTableDataSource<GroupMembers>([]);

  public members: GroupMembers[];

  @ViewChild(MatSort) sort: MatSort;

  public applications$: Observable<ApplicationItem[]>;

  public documentType = DocumentType;

  public mdmDocument = DocumentMDMType;

  public selectedTypeDevice: string;

  public inputNumberDevice: string;

  public deviceCount: number;

  public memberCount: number;

  public groupName: string;

  private groupId: string;

  public device: Devices;

  public thing: AssociatedThing;

  public isLoading = false;

  public hasResultValue = false;

  public notFoundDevice: string;

  public modalRef: BsModalRef;

  public hasThingSelected = false;

  public selectedThing: ThingWithSourceInfos;

  public formMember: FormGroup;

  public text: any = {};

  public isSaving = false;

  public disableExport = true;

  public userInfo: IUserInfoWithRole;

  public roles = Roles;

  public hasEucOrAdministratorProfile: boolean;

  constructor(
    private alertService: AlertModalService,
    private applicationService: ApplicationsService,
    private deviceService: DevicesService,
    private translate: TranslateService,
    private groupManagementService: GroupManagementService,
    private activated: ActivatedRoute,
    private liveAnnouncer: LiveAnnouncer,
    public modalService: BsModalService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) {
    this.authService.userInfo$.subscribe(user => {
      this.userInfo = user;
    });
    this.hasEucOrAdministratorProfile = !this.authService.isUserAllowedToEditDeviceGroupNames();

    this.groupId = this.activated.snapshot.params.groupId;
    this.accessComponentValidation();
    this.groupName = this.activated.snapshot.params.groupName;
    this.formMember = this.formBuilder.group({
      memberName: new FormControl(
        { value: '', disabled: true },
        Validators.required,
      ),
      memberEmail: ['', Validators.required],
      memberType: [null, Validators.required],
    });

    this.translate
      .get('EDIT_DEVICE_GROUP.VALIDATIONS.SAVE_SUCCESS')
      .subscribe(success => {
        this.text.saveSucess = success;
      });
    this.translate
      .get('EDIT_DEVICE_GROUP.VALIDATIONS.REMOVE_SUCCESS')
      .subscribe(removeSuccess => {
        this.text.removeSuccess = removeSuccess;
      });
    this.translate
      .get('EDIT_DEVICE_GROUP.VALIDATIONS.ALREADY_MEMBER_IN_GROUP')
      .subscribe(memberInGroup => {
        this.text.alreadyMemberInGroup = memberInGroup;
      });
    this.translate
      .get('EDIT_DEVICE_GROUP.VALIDATIONS.ALREADY_HAS_MANAGER_IN_GROUP')
      .subscribe(managerInGroup => {
        this.text.alreadyHasManagerInGroup = managerInGroup;
      });
  }

  ngOnInit(): void {
    this.getApplications();
    this.getInfoMembersGroup(this.groupId);
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  private getInfoMembersGroup(id: string): void {
    this.groupManagementService.GetInfoGroupById(id).subscribe(data => {
      this.members = data.memberList;
      this.deviceCount = data.deviceCount;
      this.memberCount = data.memberCount;
      this.generateTable(data.memberList);
      this.disableExportButton();
    });
  }

  private generateTable(body: GroupMembers[]): void {
    this.dataMembers = new MatTableDataSource<GroupMembers>(body);
    this.dataMembers.sort = this.sort;
  }

  public getApplications() {
    this.applications$ = this.applicationService.listApplicationsWithIncluseGroupOption();
  }

  public clearDeviceNumberField(): void {
    this.inputNumberDevice = '';
  }

  public determineMemberType(typeMember: number): string {
    let memberName: string;

    switch (typeMember) {
      case MemberTypeEnum.Member:
        memberName = MemberTypeNameEnum.Member;
        break;
      case MemberTypeEnum.FocalPoint:
        memberName = MemberTypeNameEnum.FocalPoint;
        break;
      case MemberTypeEnum.Manager:
        memberName = MemberTypeNameEnum.Manager;
        break;
      default:
        memberName = MemberTypeNameEnum.Unknown;
        break;
    }
    return memberName;
  }

  public searchDevice(): void {
    if (!this.inputNumberDevice) return;
    this.hasResultValue = false;
    this.isLoading = true;

    this.clearVariables();

    this.deviceService
      .getDeviceAndAssociationInformation(
        this.selectedTypeDevice,
        this.groupId,
        this.inputNumberDevice,
      )
      .subscribe(
        (device: Devices) => {
          if (device.devices[0].associatedThings.length > 0) {
            this.thing = device.devices[0].associatedThings[0].thing;
          }
          this.isLoading = false;
          this.hasResultValue = true;
        },
        (error: HttpErrorResponse) => {
          this.notFoundDevice = this.translate.instant(
            'DEVICES_GROUP.DEVICES_EDIT_GROUP.NOT_FOUND_DEVICE',
          );
          this.isLoading = false;
          this.hasResultValue = true;
        },
      );
  }

  public clearVariables(): void {
    this.thing = null;
    this.notFoundDevice = null;
  }

  public addMember(): void {
    this.modalRef = this.modalService.show(ThingGroupAssociationComponent, {
      class: 'ngxbootstrap-modal-controller',
    });

    this.modalRef.content.event.subscribe((data: ThingWithSourceInfos) => {
      this.selectedThing = data;
      const email = data.email === '-' ? '' : data.email.split('@')[0];

      this.formMember.patchValue({
        memberName: data.name,
        memberEmail: email,
      });

      this.hasThingSelected = true;
    });
  }

  public clearFormFields(): void {
    this.formMember.patchValue({
      memberEmail: '',
      memberType: null,
    });
  }

  public onSubmit(): void {
    this.isSaving = true;

    const email = this.formatterEmail();
    const hasThingInGroup = this.members.some(
      t => t.id === this.selectedThing.id,
    );

    const hasManagerInGroup = this.members.some(
      member => member.memberType === MemberType.Manager,
    );

    const tryingToSaveManager =
      Number(this.formMember.get('memberType').value) === MemberType.Manager;

    if (hasThingInGroup) {
      this.alertService.showAlertDanger(this.text.alreadyMemberInGroup);
      this.isSaving = false;
    } else if (tryingToSaveManager && hasManagerInGroup) {
      this.alertService.showAlertDanger(this.text.alreadyHasManagerInGroup);
      this.isSaving = false;
    } else {
      const request: CreateMember = {
        thingId: this.selectedThing.id,
        groupId: this.groupId,
        memberType: this.formMember.get('memberType').value,
        email: `${email}@vale.com`,
      };
      this.groupManagementService.CreateMemberInGroup(request).subscribe(
        () => {
          this.clearFormFields();
          this.hasThingSelected = false;
          this.isSaving = false;
          this.alertService.showAlertSuccess(this.text.saveSucess);
          this.getInfoMembersGroup(this.groupId);
        },
        (error: HttpErrorResponse) => {
          const errorMessage = this.translate.instant(
            'EDIT_DEVICE_GROUP.VALIDATIONS.REQUEST_ERROR',
          );
          this.alertService.showAlertDanger(errorMessage);
          this.isSaving = false;
        },
      );
    }
  }

  private formatterEmail(): string {
    const email = this.formMember.get('memberEmail').value;
    const emailFormated = email.substring(0, email.indexOf('@'));

    if (!emailFormated) {
      return email;
    }
    return emailFormated;
  }

  public removeMember(member: GroupMembers): void {
    const memberToRemoveMessage = this.translate.instant(
      'EDIT_DEVICE_GROUP.MODAL_REMOVE_THING.MESSAGE',
    );
    const modal = this.dialog.open(ConfirmationRemoveMemberModalComponent, {
      data: {
        title: 'EDIT_DEVICE_GROUP.MODAL_REMOVE_THING.TITLE',
        message: memberToRemoveMessage,
        memberName: member.name,
      },
      panelClass: 'custom-modal-dialog',
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.groupManagementService
          .RemoveMemberFromGroup(this.groupId, member.id)
          .subscribe(
            () => {
              this.alertService.showAlertSuccess(this.text.removeSuccess);
              this.getInfoMembersGroup(this.groupId);
            },
            (error: HttpErrorResponse) => {
              const errorMessage = this.translate.instant(
                'EDIT_DEVICE_GROUP.VALIDATIONS.REMOVE_ERROR',
              );
              this.alertService.showAlertDanger(errorMessage);
            },
          );
      }
    });
  }

  public returnAction(): void {
    if (!this.hasThingSelected) {
      this.router.navigateByUrl('groups');
    } else {
      this.clearFormFields();
      this.hasThingSelected = false;
    }
  }

  private accessComponentValidation(): void {
    const userCanEdit = this.authService.isUserAllowedToEditDevicesGroups();

    if (!userCanEdit) {
      const listOfGroupsId = JSON.parse(
        localStorage.getItem('groupsIdList'),
      ) as string[];

      if (listOfGroupsId) {
        const hasSelectedGroup = listOfGroupsId.find(l => l === this.groupId);

        if (!hasSelectedGroup) this.router.navigateByUrl('groups');
      } else {
        this.router.navigateByUrl('groups');
      }
    }
  }

  private disableExportButton(): void {
    if (this.deviceCount !== 0) {
      this.disableExport = false;
    }
  }

  public exportButton(): void {
    const dialogRef = this.dialog.open(ExportationRecipientModalComponent, {
      closeOnNavigation: false,
      disableClose: true,
      data: {
        recipientEmailAddress: this.authService.getUserInfo().mail,
      } as IExportationRecipientModalComponentData,
    });
    dialogRef.componentInstance.send.subscribe(() => {
      const exportDevicesInGroupRequest: ExportDevicesInGroupInterface = {
        groupId: this.groupId,
        applicationId: ApplicationId.SPOT,
        email: this.authService.getUserInfo().mail,
      };
      this.groupManagementService
        .ExportDevicesInGroup(exportDevicesInGroupRequest)
        .toPromise();
      this.dialog.open(ExportationDoneModalComponent, {
        closeOnNavigation: false,
        disableClose: true,
      });
    });
  }

  public editNameButton(): void {
    this.dialog.open(EditGroupNameComponent, {
      data: {
        groupName: this.groupName,
        groupId: this.groupId,
        emailUser: this.authService.getUserInfo().mail,
      } as IEditGroupNameComponentData,
    });
  }
}
