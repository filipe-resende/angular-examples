import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserAgreement } from '../../../shared/models/UserAgreement';
import { UserAgreementDocument } from '../../../shared/models/UserAgreementDocument';
import { UserAgreementService } from '../../../stores/user-agreement/user-agreement.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { ModalUserAgreementAcceptedComponent } from '../../presentational/modal-user-agreement-accepted/modal-user-agreement-accepted.component';

@Component({
  selector: 'app-modal-user-agreement',
  templateUrl: './modal-user-agreement.component.html',
  styleUrls: ['./modal-user-agreement.component.scss'],
})
export class ModalUserAgreementComponent implements OnInit, OnDestroy {
  public userAgreementDocument: UserAgreementDocument;

  public readAndAgreeCheck = false;

  public userAgreement: UserAgreement;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalUserAgreementComponent>,
    private userAgreementService: UserAgreementService,
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    const documentSub = this.userAgreementService.document$.subscribe(
      document => {
        this.userAgreementDocument = document;
      },
    );
    this.subscriptions.push(documentSub);
    this.setupUserAgreedSub();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public async handleAcceptAgreementClick(): Promise<void> {
    const {
      email
    } = this.userProfileService.getUserProfile();

    await this.userAgreementService.acceptUserAgreement(
      this.userAgreementDocument.id,
      email,
    );

    this.openUserAgreementAcceptedModal();
    this.onClose();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  private openUserAgreementAcceptedModal() {
    this.dialog.open(ModalUserAgreementAcceptedComponent, {
      panelClass: 'modal-user-agreement-accepted',
    });
  }

  private setupUserAgreedSub(): void {
    const userAgreementSub = this.userAgreementService.userAgreement$.subscribe(
      userAgreement => {
        this.userAgreement = userAgreement;
      },
    );
    this.subscriptions.push(userAgreementSub);
  }
}
