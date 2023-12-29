import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { LoggingService } from 'src/app/services/logging/logging.service';
import { DisassociateModalComponent } from 'src/app/components/disassociate-modal/disassociate-modal.component';

@Component({
  selector: 'app-disassociate-button',
  templateUrl: 'disassociate-button.component.html',
})
export class DisassociateButtonComponent {
  @Input() isAllAssociated;

  @Input() isDisabled: boolean;

  @Output() emitDisassociation = new EventEmitter<boolean>();

  public modalRef: BsModalRef;

  constructor(
    public modalService: BsModalService,
    public loggingService: LoggingService,
  ) {}

  public disassociateDevice(devices): void {
    this.modalRef = this.modalService.show(DisassociateModalComponent);
    this.modalRef.content.singleData = devices;
    this.modalRef.content.event.subscribe(
      data => {
        const isDesassociated = !!data.disassociationDate.length;
        this.emitDisassociation.emit(isDesassociated);
      },
      error => {
        this.loggingService.logException(error, SeverityLevel.Warning);
      },
    );
  }
}
