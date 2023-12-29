import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-header-user-menu-overlay",
  templateUrl: "header-user-menu-overlay.component.html",
  styleUrls: ["header-user-menu-overlay.component.scss"],
})
export class HeaderUserMenuOverlayComponent implements OnInit {
  @Input()
  public items: Array<{ icon: string; label: string; click: () => void }> = [];

  @Input()
  public target: HTMLElement;

  @Input()
  public overlayRef;

  public menuWidth: number = 155;

  public ngOnInit() {
    if (this.target && this.target.offsetWidth) {
      this.menuWidth = this.target.offsetWidth;
    }
  }

  public onItemClick(item) {
    if (_.isFunction(item.click)) {
      item.click();
    } // emite a função da overlay

    if (this.overlayRef) {
      // fecha a overlay
      this.overlayRef.detach();
    }
  }
}
// ele usa o array ali, pq como isso é um componente, ele vai repetir n vezes... e cada repetição terá uma funçào especifica, ele fez isso por conta do ngFor
