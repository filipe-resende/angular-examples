import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss'],
})
export class CustomPaginationComponent {
  @Input() id: string;

  @Input() maxSize: number;

  @Input() currentPage = 1;

  @Input() ngClass: string;

  @Input() totalCount: number;

  @Output() pageChange = new EventEmitter<number>();

  @Output() pageBoundsCorrection: EventEmitter<number>;

  public setPage(page: number): void {
    this.currentPage = page;

    this.pageChange.emit(page);
  }
}
