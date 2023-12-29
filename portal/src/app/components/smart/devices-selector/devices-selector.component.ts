import {
  Component,
  Output,
  EventEmitter,
  Input,
  AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationService } from '../../../core/services/application-service/application.service';
import Application from '../../../shared/models/application';

@Component({
  selector: 'app-devices-selector',
  templateUrl: './devices-selector.component.html',
  styleUrls: ['./devices-selector.component.scss']
})
export class DevicesSelectorComponent implements AfterViewInit {
  @Input()
  selected: string;

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  middleware = false;

  @Input()
  isDeviceScreen = false;

  @Output()
  onSelect = new EventEmitter<Application>();

  public applications$: Observable<Application[]>;

  public isActiveDeviceGroupFiltering: boolean;

  constructor(private aplicationService: ApplicationService) {}

  public ngAfterViewInit(): void {
    this.InitializeApplications();
  }

  private InitializeApplications() {
    this.applications$ =
      this.aplicationService.getApplicationForDevicesScreen();
  }

  public onApplicationSelect(application: Application): void {
    this.onSelect.emit(application);
  }
}
