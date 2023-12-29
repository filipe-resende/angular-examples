import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detectors-list',
  templateUrl: './detectors-list.component.html',
  styleUrls: ['./detectors-list.component.scss'],
})
export class DetectorsListComponent {
  @Input() detectors: [];

  @Input() currentPage = 1;

  @Input() count: number;

  @Input() totalCount: number;

  @Output() onPaginate = new EventEmitter();

  paginate(value: number) {
    this.onPaginate.emit(value);
  }
}
