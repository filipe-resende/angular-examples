import { Component, OnInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BreadcrumbService } from '../../../../stores/breadcrumb/breadcrumb.service';
import { BreadcrumbItem } from '../../../../stores/breadcrumb/breadcrumb.state';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  public isVisible = false;

  public stack: BreadcrumbItem[] = [];

  private subscriptions: Subscription[];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  public ngOnInit() {
    this.subscriptions = [
      this.breadcrumbService.isVisible$.subscribe(
        isVisible => (this.isVisible = isVisible)
      ),
      this.breadcrumbService.stack$.subscribe(stack => (this.stack = stack))
    ];
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public onBreadcrumbItemClick(breadcrumbItem: BreadcrumbItem) {
    this.router.navigateByUrl(breadcrumbItem.route);
  }
}
