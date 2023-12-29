import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: 'label.component.html',
  styleUrls: ['label.component.scss']
})
export class LabelComponent {
  @Input()
  public iconName: string;

  @Input()
  public stretched = false;

  @Input()
  public maxWidthLength?: number;

  @Input()
  public tooltip: string;

  @Input()
  public text = '';
}
