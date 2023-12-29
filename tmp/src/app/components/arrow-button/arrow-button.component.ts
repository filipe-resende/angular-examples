import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-button',
  templateUrl: './arrow-button.component.html',
  styleUrls: ['./arrow-button.component.scss'],
})
export class ArrowButtonComponent {
  @Input() ngClass: string;

  @Input() routerLink: string;

  @Input() label: string;
}
