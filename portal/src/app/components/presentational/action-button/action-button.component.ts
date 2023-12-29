import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html'
})
export class ActionButtonComponent {
  @Output() action = new EventEmitter();

  public active = false;

  clickAction() {
    this.action.emit();
  }
}
