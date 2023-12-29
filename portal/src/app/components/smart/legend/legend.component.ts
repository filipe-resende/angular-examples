import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Legend {
  public minimized = false;

  public icoPath: string;

  public minimize(): void {
    this.minimized = !this.minimized;
    this.getIcoPath();
  }

  private getIcoPath(): void {
    this.icoPath = this.minimized
      ? 'assets/icons/share.svg'
      : 'assets/icons/minimizar.svg';
  }
}
