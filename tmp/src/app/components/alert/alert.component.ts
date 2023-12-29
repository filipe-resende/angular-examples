import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertType, AlertIcon } from 'src/app/shared/enums//alertTypesAndIcons';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  public icon: string;

  @Input()
  public text: string;

  @Input()
  type = AlertType.Information;

  @Output() close = new EventEmitter();

  ngOnInit(): void {
    switch (this.type) {
      case AlertType.Warning:
        this.icon = AlertIcon.Warning;
        break;
      case AlertType.Confirm:
        this.icon = AlertIcon.Confirm;
        break;
      default:
        this.icon = AlertIcon.Information;
    }
  }
}
