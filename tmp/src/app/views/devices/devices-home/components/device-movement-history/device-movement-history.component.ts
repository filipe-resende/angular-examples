import { Component, Input } from '@angular/core';
import { MovementHistoryList } from 'src/app/shared/interfaces/movement-history-list.interface';

@Component({
  selector: 'app-device-movement-history',
  templateUrl: './device-movement-history.component.html',
  styleUrls: ['./device-movement-history.component.scss'],
})
export class DeviceMovementHistoryComponent {
  @Input()
  public movementList: MovementHistoryList[];

  @Input()
  public isLoadingList: boolean;
}
