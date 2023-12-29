import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThingItem } from 'src/app/model/things-interfaces';
import { DeviceItem } from '../../model/devices-interfaces';

@Component({
  selector: 'app-item-device',
  templateUrl: './item-device.component.html',
  styleUrls: ['./item-device.component.scss', '../../scss/_global.scss'],
})
export class ItemDeviceComponent implements OnInit {
  @Input() ngClass: string;

  @Input() route: string;

  @Input() externalData: any;

  @Input() checked: boolean;

  @Output() ngClick = new EventEmitter();

  @Output() ngSelect = new EventEmitter();

  public device: DeviceItem;

  public associatedThings: ThingItem[];

  public thing;

  ngOnInit(): void {
    if (this.externalData.associatedThings) {
      const { device, associatedThings } = this.externalData;
      this.device = device;
      this.associatedThings = associatedThings;

      if (associatedThings.length > 0) {
        this.thing = associatedThings.find(thing => thing.id > 0);
      }
    } else {
      this.device = this.externalData;
    }
  }

  public clickAction(): void {
    if (this.device) {
      this.ngClick.emit(this.device);
    }
  }

  public onSelect(event: any): void {
    this.ngSelect.emit(event.target.checked);
  }
}
