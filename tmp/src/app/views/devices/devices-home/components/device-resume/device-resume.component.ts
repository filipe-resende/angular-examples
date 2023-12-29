import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { DeviceStatus } from 'src/app/model/device-status';
import {
  DeviceAssociationThing,
  DeviceItem,
} from 'src/app/model/devices-interfaces';
import { ThingResumeSourceInfos } from 'src/app/model/things-interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AssociationDesassociationScreenEnum } from 'src/app/shared/enums/associationDesassociationScreen';
import { DeviceStatusIdEnum } from 'src/app/shared/enums/deviceStatus.enum';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { DeviceStatusStateService } from 'src/app/stores/device-status/device-status-state.service';

@Component({
  selector: 'app-device-resume',
  templateUrl: './device-resume.component.html',
  styleUrls: ['./device-resume.component.scss'],
})
export class DeviceResumeComponent implements OnChanges {
  @Input() device: DeviceItem;

  @Input() associatedThing: DeviceAssociationThing;

  @Input() isDeviceAssociated = true;

  @Input() doesApplicationAllowAssociation = true;

  @Input() application: ApplicationItem;

  @Output() emitRefresh = new EventEmitter();

  public isSensitiveDocumentsVisible = false;

  public readonly screen = AssociationDesassociationScreenEnum.Devices;

  public thingResumeSourceInfos: ThingResumeSourceInfos;

  public deviceStatusIdEnum = DeviceStatusIdEnum;

  private readonly noData = ' - ';

  public status: DeviceStatus;

  public statusName: string;

  public activeStatus = 'Ativo';

  public deviceStatusOptions: DeviceStatus[] = [];

  constructor(
    private authService: AuthService,
    private deviceStatusStateService: DeviceStatusStateService,
  ) {}

  ngOnInit(): void {
    this.verifyIfUserCanSeeSensitiveDocuments();

    this.deviceStatusStateService.deviceStatus$.subscribe(
      deviceStatusResponse => {
        this.deviceStatusOptions = deviceStatusResponse;
        this.status = this.deviceStatusOptions.find(
          status =>
            status.id ===
            this.deviceStatusOptions[this.device.deviceStatusId - 1].id,
        );
        this.statusName = this.status.name;
      },
    );
  }

  private verifyIfUserCanSeeSensitiveDocuments() {
    this.isSensitiveDocumentsVisible = [
      Roles.Administrador,
      Roles.AnalistaSegurancaEmpresarial,
    ].includes(this.authService.getUserInfo().role);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue, previousValue } = changes.associatedThing;

    if (!currentValue || currentValue !== previousValue) {
      this.thingResumeSourceInfos = this.getThingResumeSourceInfos(
        currentValue,
      );
    }
  }

  getThingResumeSourceInfos(
    associatedThing: DeviceAssociationThing,
  ): ThingResumeSourceInfos {
    const cpfType = 'CPF';
    const iamType = 'IAMID';
    const passportType = 'PASSPORT';
    const emptyThingResumeSourceInfos = {
      cpf: this.noData,
      passport: this.noData,
      iam: this.noData,
    };

    if (associatedThing && associatedThing.thing) {
      const { sourceInfos } = associatedThing.thing;

      if (sourceInfos) {
        const cpfValue = sourceInfos.find(
          sourceInfo => sourceInfo.type === cpfType,
        )?.value;
        const iamValue = sourceInfos.find(
          sourceInfo => sourceInfo.type === iamType,
        )?.value;
        const passportValue = sourceInfos.find(
          sourceInfo => sourceInfo.type === passportType,
        )?.value;

        return {
          cpf: cpfValue || this.noData,
          passport: passportValue || this.noData,
          iam: iamValue || this.noData,
        };
      }
      return emptyThingResumeSourceInfos;
    }
    return emptyThingResumeSourceInfos;
  }

  refreshEventHandler(value: boolean) {
    if (value) {
      this.emitRefresh.emit(value);
    }
  }
}
