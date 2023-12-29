import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-outline',
  templateUrl: './action-button-outline.component.html',
  styleUrls: ['./action-button-outline.component.scss'],
})
export class ActionButtonOutlineComponent {
  @Input() ngClass: string[];

  @Input() labelClass: string[];

  @Input() ngClassDisabled: string[];

  @Input() labelClassDisabled: string[];

  @Input() icon: string;

  @Input() type: string;

  @Input() isDisabled = false;

  @Output() ngClick = new EventEmitter();

  clickAction() {
    this.ngClick.emit();
  }
}
