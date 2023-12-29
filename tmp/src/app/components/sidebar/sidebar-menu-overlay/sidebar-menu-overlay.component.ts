import { Component, Input, OnInit } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { BatchItem } from 'src/app/model/batch-item';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar-menu-overlay',
  templateUrl: './sidebar-menu-overlay.component.html',
  styleUrls: ['./sidebar-menu-overlay.component.scss'],
})
export class SidebarMenuOverlayComponent implements OnInit {
  public overlayRef: OverlayRef;

  @Input() items: BatchItem[];

  itemMenu: BatchItem[];

  private userRole: Roles;

  public target: HTMLElement;

  public showSubmenu;

  public nameLoadType = 'Carga em Lote';

  public approveSubmenu = true;

  public denySubmenu = false;

  public menuWidth = 200;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.userRole = userInfo.role;
    this.items = this.mapAuthorizedItemsToDisplayOrHide(this.items);
  }

  public onClick(item: string): void {
    if (item) {
      this.router.navigateByUrl(item);
      this.overlayRef.detach();
    }
  }

  public genereteIcon(item) {
    if (item.name === this.nameLoadType) {
      return true;
    }
    return false;
  }

  public generateSubmenu(item) {
    if (item.name === this.nameLoadType) {
      this.showSubmenu = true;
    } else {
      this.showSubmenu = false;
    }
  }

  private mapAuthorizedItemsToDisplayOrHide(items: BatchItem[]) {
    return items.map(item => {
      const isAllowed = item.roles?.some(role => role === this.userRole);
      return { ...item, show: isAllowed } as BatchItem;
    });
  }
}
