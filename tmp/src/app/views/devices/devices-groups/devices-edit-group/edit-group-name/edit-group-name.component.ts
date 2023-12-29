/* eslint-disable prefer-destructuring */
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationRemoveMemberModalComponent } from 'src/app/components/confirmation-remove-member-modal/confirmation-remove-member-modal-component';
import { IEditGroupNameComponentData } from 'src/app/model/device-group-management/edit-group-name-component-interface';
import { UpdateGroup } from 'src/app/model/device-group-management/update-group-interface';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { GroupManagementService } from 'src/app/services/factories/group-management.service';

@Component({
  selector: 'app-edit-group-name',
  templateUrl: './edit-group-name.component.html',
  styleUrls: ['./edit-group-name.component.scss'],
})
export class EditGroupNameComponent implements OnInit {
  public showGroupDataValidator = false;

  public showManagement = false;

  public showSapPlant = false;

  public enableButton = true;

  public managementName: string;

  public sapPlantCode: number;

  public managerEmail: string;

  public groupName: string;

  public managementId: string;

  public sapPlantId: string;

  public managerEmailValidatorView = false;

  public isLoadingGroup = false;

  constructor(
    private alertService: AlertModalService,
    private translate: TranslateService,
    private groupManagementService: GroupManagementService,
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditGroupNameComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IEditGroupNameComponentData,
  ) {}

  ngOnInit(): void {
    this.getGroupData(this.data.groupName);
  }

  public onClose(): void {
    this.dialogRef.close(false);
  }

  public getGroupData(groupName: string): void {
    const groupData = groupName.split('_');

    this.data.managementCode = parseInt(groupData[0], 10);
    this.data.sapPlantCode = parseInt(groupData[2], 10);
    this.data.managerEmail = groupData[3].split('@')[0];

    this.managerEmail = this.data.managerEmail;
  }

  public showManagementData(event: boolean): void {
    if (event) {
      this.showManagement = true;
      this.showGroupData();
    }
  }

  public showSapPlantData(event: boolean): void {
    if (event) {
      this.showSapPlant = true;
      this.showGroupData();
    }
  }

  public showGroupData(): void {
    if (this.showManagement && this.showSapPlant)
      this.showGroupDataValidator = true;
  }

  public saveManagementName(managementName: string): void {
    this.managementName = managementName;
  }

  public saveManagementId(managementId: string): void {
    this.managementId = managementId;
  }

  public saveSapPlantCode(sapPlantCode: number): void {
    this.sapPlantCode = sapPlantCode;
  }

  public saveSapPlantId(sapPlantId: string): void {
    this.sapPlantId = sapPlantId;
  }

  public validatorManagerEmail(): void {
    if (this.managerEmail && !this.checkFirsCharacterOfManagerEmail()) {
      this.managerEmailValidatorView = false;
    } else {
      this.managerEmailValidatorView = true;
    }
  }

  public checkField(): void {
    const enabledFields = [
      this.managementName,
      this.sapPlantCode,
      this.managerEmail,
    ];

    if (
      enabledFields.every(val => val && val !== '') &&
      !this.checkFirsCharacterOfManagerEmail()
    ) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }

  public checkFirsCharacterOfManagerEmail(): boolean {
    if (this.managerEmail) {
      const regex = /^[a-zA-Z]/;
      const CheckRegex = regex.test(this.managerEmail);
      return !CheckRegex;
    }
    return false;
  }

  public generateNewGroupName(): UpdateGroup {
    const completedManagerEmail = `${this.managerEmail}@vale.com`;

    this.groupName = `${this.managementName.replace(' - ', '_')}_${
      this.sapPlantCode
    }_${completedManagerEmail}`;

    return {
      groupId: this.data.groupId,
      groupName: this.groupName,
      managerEmail: completedManagerEmail,
      userEmail: this.data.emailUser,
      managementId: this.managementId,
      sapPlantId: this.sapPlantId,
    };
  }

  public editGroupName(): void {
    const updateGroup = this.generateNewGroupName();
    const modal = this.dialog.open(ConfirmationRemoveMemberModalComponent, {
      data: {
        title: 'EDIT_DEVICE_GROUP.EDIT_GROUP_NAME.MODAL_CONFIRM.TITLE',
        message: `Tem certeza que deseja editar o grupo ${this.data.groupName} para grupo`,
        memberName: `${this.groupName}`,
      },
      panelClass: 'custom-modal-dialog',
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.isLoadingGroup = true;
        this.groupManagementService.UpdateGroup(updateGroup).subscribe(
          () => {
            this.dialogRef.close();
            this.isLoadingGroup = false;
            this.alertService.showAlertSuccess(
              this.translate.instant(
                'EDIT_DEVICE_GROUP.EDIT_GROUP_NAME.MODAL_ALERT.SUCCESS',
              ),
            );
            this.router.navigate(['/groups']);
          },
          () => {
            this.isLoadingGroup = false;
            this.alertService.showAlertDanger(
              this.translate.instant(
                'EDIT_DEVICE_GROUP.EDIT_GROUP_NAME.MODAL_ALERT.ERROR',
              ),
            );
          },
        );
      }
    });
  }
}
