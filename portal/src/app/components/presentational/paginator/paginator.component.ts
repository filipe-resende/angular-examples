import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Paginator {
  page: number;
  perPage: number;
  total: number;
}

@Component({
  selector: 'app-paginator',
  templateUrl: 'paginator.component.html',
  styleUrls: ['paginator.component.scss'],
})
export class PaginatorComponent {
  @Input()
  public pageSize = 10;

  @Input()
  public total = 0;

  @Output()
  public onChangePage = new EventEmitter();

  @Input()
  public currentPage = 1;

  @Input()
  public onlyBeforeAndNext = false;

  public maxPages = 10;

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  get virtualPages(): number[] {
    const pageIndexes = Array.from(
      Array(
        this.totalPages > this.maxPages ? this.maxPages : this.totalPages,
      ).keys(),
    );

    const pageIndexesStartingWith1 = pageIndexes.map(m => m + 1);

    if (this.totalPages <= this.maxPages || this.currentPage < this.maxPages) {
      return pageIndexesStartingWith1;
    }

    let currentPageIterator = this.currentPage - 5;

    const pageIndexesStartingWithTotalPages = pageIndexesStartingWith1.map(
      () => {
        currentPageIterator += 1;
        const nextPageIndex = currentPageIterator;
        return nextPageIndex > this.totalPages ? undefined : nextPageIndex;
      },
    );

    return pageIndexesStartingWithTotalPages;
  }

  public setPage(page: number): void {
    this.currentPage = page;

    this.onChangePage.emit({
      page,
      perPage: this.pageSize,
      total: this.total,
    });
  }

  public onGetPreviousPageClick(): void {
    const page = this.currentPage - 1;

    if (page >= 1) {
      this.setPage(page);
    }
  }

  public onGetNextPageClick(): void {
    this.setPage(this.currentPage + 1);
  }
}
