import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { SidenavService } from '../sidenav.service';
import { SidenavItem } from './item.model';

@Component({
  selector: 'sidenav-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemComponent implements OnInit {
  @Input() public item: SidenavItem;

  @HostBinding('class.open')
  public get isOpen() {
    return this.service.isOpen(this.item);
  }

  constructor(private service: SidenavService) {}

  public ngOnInit() {
    //
  }

  public toggleDropdown(): void {
    if (this.item.hasSubItems()) {
      this.service.toggleCurrentlyOpen(this.item);
    }
  }

  public getSubItemsHeight() {
    if (this.item.hasSubItems()) {
      return `${this.getOpenSubItemsCount(this.item) * 56}px`;
    }
  }

  public getOpenSubItemsCount(item: SidenavItem): number {
    let count = 0;

    if (item.hasSubItems() && this.service.isOpen(item)) {
      count += item.subItems.length;
      item.subItems.forEach(subItem => {
        count += this.getOpenSubItemsCount(subItem);
      });
    }
    return count;
  }
}
