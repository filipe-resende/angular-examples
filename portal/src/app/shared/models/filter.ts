import { PageEvent } from '@angular/material/paginator';

export class Filter {
  public page = 1;

  public perPage = 20;

  public filter: string = null;

  public total = 0;

  public update(event: PageEvent) {
    this.total = event.length;
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
  }
}
