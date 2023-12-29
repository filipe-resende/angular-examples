import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { LoggingService } from 'src/app/services/logging/logging.service';
import { SeverityLevel } from '@microsoft/applicationinsights-web';

import { ThingsModalComponent } from 'src/app/components/things-modal/things-modal.component';

@Component({
  selector: 'app-associate-button',
  templateUrl: 'associate-button.component.html',
  styleUrls: ['associate-button.component.scss'],
})
export class AssociateButtonComponent {
  @Input() deviceInfo;

  @Input() isDisabled: boolean;

  @Output() emitAssociation = new EventEmitter<boolean>();

  public modalRef: BsModalRef;

  public associationConfig: ModalOptions = {
    class: 'ngxbootstrap-modal-controller',
  };

  constructor(
    public modalService: BsModalService,
    public loggingService: LoggingService,
  ) {}

  public associateDevice(devices: any): void {
    this.modalRef = this.modalService.show(ThingsModalComponent, {
      ...this.associationConfig,
      class: 'ngxbootstrap-modal-controller',
      initialState: this.deviceInfo,
    });

    this.modalRef.content.event.subscribe(
      data => {
        const allChanged = !!data.thing;
        this.emitAssociation.emit(allChanged);
      },
      error => {
        console.error(error);
        this.loggingService.logException(error, SeverityLevel.Warning);
      },
    );
  }
}
