import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { IamRolesDescriptions, Roles } from 'src/app/shared/enums/iam.enums';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';
import { AuthService } from '../../services/auth/auth.service';

interface SettingsModalUserInfo extends IUserInfoWithRole {
  language: string;
  roleDescription: string;
}
@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
  public userInfo: SettingsModalUserInfo = {
    cn: '',
    groupMembership: [],
    mail: '',
    FirstName: '',
    UserFullName: '',
    language: '',
    role: null,
    roleDescription: '',
  };

  constructor(
    private dialogRef: MatDialogRef<SettingsModalComponent>,
    private translateService: TranslateService,
    private authService: AuthService,
  ) {
    this.userInfo.language = this.translateService.currentLang;
    this.authService.userInfo$
      .pipe(filter(userInfo => !!userInfo))
      .subscribe(userInfo => {
        this.userInfo = userInfo as SettingsModalUserInfo;
        this.userInfo.roleDescription =
          IamRolesDescriptions[Roles[this.userInfo.role]];
      });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public submitChanges(): void {
    this.dialogRef.close();
  }
}
