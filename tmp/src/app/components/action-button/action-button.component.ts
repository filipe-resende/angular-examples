import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent {
  @Output() action = new EventEmitter();

  @Input() ngClass: string[];

  @Input() ngClassDisabled: string[];

  @Input() labelClass: string[];

  @Input() labelClassDisabled: string[];

  @Input() disabled: boolean;

  @Input() type: string;

  public active = false;

  clickAction() {
    this.action.emit();
  }
}
