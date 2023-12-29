import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-list',
  templateUrl: 'application-list.component.html',
  styleUrls: ['application-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationListComponent {
  @Input() applications = [];

  @Input() totalCount: number;

  @Input() currentPage = 1;

  @Output() paginate = new EventEmitter();

  constructor(private router: Router) {}

  public onSelect(applicationId: string): void {
    this.router.navigate([`applications/update/${applicationId}`]);
  }

  public changePage(event): void {
    this.currentPage = event;
    this.paginate.emit(event);
  }
}
