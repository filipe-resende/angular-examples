import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationItem } from '../../../../model/applications-interfaces';

@Component({
  selector: 'app-application-item',
  templateUrl: './application-item.component.html',
  styleUrls: ['./application-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationItemComponent {
  @Input() applicationInfo: ApplicationItem;

  constructor(private router: Router) {}

  public routeToApplicationDetails(id: string): void {
    this.router.navigate([`applications/update/${id}`]);
  }
}
