import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.page';
import { FencesPage } from './fences/fences.page';
import { HistoricPage } from './historic/historic.page';
import { ListPage } from './list/list.page';
import { DisplacementPage } from './displacement/displacement.page';
import { NotificationsPage } from './notifications/notifications.page';
import { DevicesPage } from './devices/devices.page';
import { Role } from '../shared/enums/role';
import { FlightsAndGatesPage } from './flights-and-gates/flights-and-gates.page';
import { FlightsAndGatesPeoplePage } from './flights-and-gates-people/flights-and-gates-people.page';
import { DisplacementMapComponent } from './displacement-map/displacement-map.component';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.Transport,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: '',
    component: DashboardPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.Transport,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard],
    pathMatch: 'full'
  },
  {
    path: 'historic',
    component: HistoricPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'list',
    component: ListPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'displacement-new',
    component: DisplacementPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.Transport,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'displacement-new/map',
    component: DisplacementMapComponent,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.Transport,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'flights-and-gates',
    component: FlightsAndGatesPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.Transport,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'flights-and-gates/people',
    component: FlightsAndGatesPeoplePage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.Transport,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'fence',
    component: FencesPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'focal',
    redirectTo: ''
  },
  {
    path: 'notifications',
    component: NotificationsPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm
      ]
    },
    canActivate: [RoleGuard]
  },
  {
    path: 'devices',
    component: DevicesPage,
    data: {
      expectedRoles: [
        Role.BusinessSecurityAnalyst,
        Role.Consult,
        Role.ControlCenter,
        Role.OperationalAnalyst,
        Role.Paebm,
        Role.Facilities,
        Role.OtherAreas
      ]
    },
    canActivate: [RoleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
