import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-title',
  templateUrl: './main-title.component.html',
  styleUrls: ['./main-title.component.scss'],
})
export class MainTitleComponent {
  @Input() title: string;

  @Input() vclass;
}
