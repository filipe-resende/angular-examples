import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/components/alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AlertModalService {
  constructor(private modalService: BsModalService) {}

  private showAlert(title: string, subtitle?: string, success?: boolean) {
    const bsModalRef: BsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.title = title;
    bsModalRef.content.subtitle = subtitle;
    bsModalRef.content.success = success;
  }

  showAlertDanger(title: string, subtitle?: string) {
    this.showAlert(title, subtitle, false);
  }

  showAlertSuccess(title: string, subtitle?: string) {
    this.showAlert(title, subtitle, true);
  }
}
