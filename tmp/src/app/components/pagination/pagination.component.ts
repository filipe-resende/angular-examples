/* eslint-disable no-plusplus */
/* eslint-disable no-empty */

import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output() nextPage = new EventEmitter();

  @Output() previousPage = new EventEmitter();

  @Output() selectPage = new EventEmitter();

  @Input() value = 1;

  @Input() countInput = null;

  @Input() currentPage = 0;

  public count;

  public bottom = 1;

  public top;

  ngOnInit(): void {
    this.setPageCount(this.countInput);
    this.count = this.numberToList(this.count);
    this.currentPage = 0;
    this.top = this.count.length >= 50 ? 5 : this.count.length / 10;
  }

  ngOnChanges(props) {
    this.ngOnInit();
  }

  clickForward() {
    this.value++;
    this.nextPage.emit();
    this.setPageLimit(this.currentPage + 1);
  }

  clickPrevious() {
    this.value = this.value <= 1 ? 1 : --this.value;
    this.previousPage.emit();

    if (this.currentPage - 1 < 0) {
    } else {
      this.setPageLimit(this.currentPage + -1);
    }
  }

  setPageCount(count: number) {
    this.count = Math.floor(count / 10);
  }

  numberToList(num: number) {
    const count = [];

    for (let index = 0; index < num; index++) {
      count[index] = index;
    }
    return count;
  }

  setPageTo(item) {
    this.selectPage.emit(item);
    this.setPageLimit(item);
  }

  setPageLimit(num: number) {
    this.currentPage = num;

    this.bottom = num - 2 <= 0 ? 1 : num - 2;
    this.top = num + 2 >= this.count.length ? this.count.length - 1 : num + 2;

    if (num - 2 <= 0) {
      this.top = num === 2 ? num + 3 : num + 4;
    }

    if (num === this.count.length - 1) {
      this.bottom = num - 4;
      this.top = num - 1;
    }
  }
}
