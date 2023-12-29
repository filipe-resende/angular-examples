import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserAgreement } from 'src/app/model/user-agreement';
import { UserAgreementDocument } from 'src/app/model/user-agreement-document';
import { UserAgreementService } from 'src/app/stores/user-agreement/user-agreement.service';
import { ModalUserAgreementAcceptedComponent } from '../../modal-user-agreement-accepted/modal-user-agreement-accepted.component';

@Component({
  selector: 'app-user-agreement-modal',
  templateUrl: './user-agreement-modal.component.html',
  styleUrls: ['./user-agreement-modal.component.scss'],
})
export class UserAgreementModalComponent implements OnDestroy {
  public readAndAgreed = false;

  public sendingData = false;

  private subscriptions: Subscription[] = [];

  public modalUserAgreementData$: Observable<{
    document: UserAgreementDocument;
    userAgreement: UserAgreement;
  }>;

  constructor(
    private dialogRef: MatDialogRef<UserAgreementModalComponent>,
    private dialog: MatDialog,
    private userAgreementService: UserAgreementService,
  ) {}

  public ngOnInit(): void {
    this.modalUserAgreementData$ = combineLatest([
      this.userAgreementService.document$,
      this.userAgreementService.userAgreement$,
    ]).pipe(map(([document, userAgreement]) => ({ document, userAgreement })));

    this.setupAcceptanceSub();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.userAgreementService.resetAcceptance();
  }

  public handleAcceptAgreementClick(documentId: string) {
    this.sendingData = true;
    this.userAgreementService.updateUserAgreementAcceptance(documentId);
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  private setupAcceptanceSub(): void {
    const acceptanceSub = this.userAgreementService.accepted$
      .pipe(filter(accepted => accepted))
      .subscribe(() => {
        this.sendingData = false;
        this.onClose();
        this.openUserAgreementAcceptedModal();
      });

    this.subscriptions.push(acceptanceSub);
  }

  private openUserAgreementAcceptedModal() {
    this.dialog.open(ModalUserAgreementAcceptedComponent, {
      panelClass: 'modal-user-agreement-accepted',
      closeOnNavigation: false,
      disableClose: true,
    });
  }
}
