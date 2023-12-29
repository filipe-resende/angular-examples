import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { DeviceItem } from 'src/app/model/devices-interfaces';
import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
import { DisassociateModalComponent } from 'src/app/components/disassociate-modal/disassociate-modal.component';
import { FixMeLater } from 'src/app/shared/types/shared-types';
import { AssociationDesassociationScreenEnum } from 'src/app/shared/enums/associationDesassociationScreen';
import { DeviceWithAssociatedThings } from 'src/app/model/device-with-associated-things-interface';

@Component({
  selector: 'app-device-history',
  templateUrl: './device-history.component.html',
  styleUrls: ['./device-history.component.scss'],
})
export class DeviceHistoryComponent implements OnChanges {
  @Output() emitRefresh = new EventEmitter();

  @Input() device: DeviceItem;

  @Input() application: ApplicationItem;

  @Input() doesApplicationAllowAssociation = false;

  public deviceAssociationPeriods$: Observable<FixMeLater>;

  public historyData: FixMeLater;

  public screen = AssociationDesassociationScreenEnum.Devices;

  public modalRef: BsModalRef;

  public disassociationData: FixMeLater;

  constructor(
    private associationPeriodsService: AssociationPeriodsService,
    private bsModalService: BsModalService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { application, device } = changes;

    if (
      application.currentValue !== application.previousValue ||
      device.currentValue !== device.previousValue
    ) {
      this.device = device.currentValue;
      this.application = application.currentValue;
      this.loadData();
    }
  }

  public loadData(): void {
    this.getDeviceAssociationPeriod(this.application.id, this.device.id);
  }

  private getDeviceAssociationPeriod(
    applicationId: string,
    deviceId: string,
  ): void {
    this.deviceAssociationPeriods$ = this.associationPeriodsService.getDeviceAssociations(
      applicationId,
      deviceId,
    );
    this.deviceAssociationPeriods$.subscribe(data => {
      this.disassociationData = this.setupPayloadDisassociation(data);
      this.historyData = data.associatedThings;
    });
  }

  private setupPayloadDisassociation(data: DeviceWithAssociatedThings) {
    return {
      associatedThings: data.associatedThings,
      device: data.device,
      screen: this.screen,
    };
  }

  public onRequestDisassociation(): void {
    this.modalRef = this.bsModalService.show(DisassociateModalComponent);
    this.modalRef.content.singleData = this.disassociationData;
    return this.modalRef.content.event.subscribe(() => {
      this.loadData();
      this.emitRefresh.emit();
    });
  }

  refreshEventHandler(value: boolean) {
    if (value) {
      this.emitRefresh.emit(value);
    }
  }
}
