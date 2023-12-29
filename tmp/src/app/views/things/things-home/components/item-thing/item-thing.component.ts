import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationItem } from 'src/app/model/applications-interfaces';
import { ThingItem } from 'src/app/model/things-interfaces';

@Component({
  selector: 'app-item-thing',
  templateUrl: './item-thing.component.html',
  styleUrls: ['./item-thing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemThingComponent implements OnInit {
  @Input() thingInfo: ThingItem;

  @Input() applicationList: ApplicationItem[];

  @Input() currentDeviceApplication: ApplicationItem;

  constructor(private router: Router) {}

  public data: ThingItem;

  ngOnInit(): void {
    if (this.thingInfo) {
      this.data = this.thingInfo;
    }
  }

  public routeToThingDetails(id: string): void {
    this.router.navigate([`things/update/${id}`]);
  }
}
