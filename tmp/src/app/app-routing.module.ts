import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedPageComponent } from './views/access-denied-page/access-denied-page.component';
import { DetectorsComponent } from './views/detectors/detectors.component';
import { MainComponent } from './views/main/main.component';
import { NotAuthorizedComponent } from './views/not-authorized/not-authorized.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { Role } from './shared/enums/role';
import { RoleGuard } from './core/role.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'devices',
        pathMatch: 'full',
      },
      {
        path: 'applications',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import('./views/applications/applications.module').then(
            el => el.ApplicationsModule,
          ),
      },
      {
        path: 'metrics',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import(
            './views/applications/application-metrics/application-metrics-routing.module'
          ).then(el => el.ApplicationMetricsRoutingModule),
      },
      {
        path: 'devices',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import('./views/devices/devices.module').then(el => el.DevicesModule),
      },
      {
        path: 'groups',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import('./views/devices/devices-groups/devices-group.module').then(
            el => el.DevicesGroupsRoutingModule,
          ),
      },
      {
        path: 'groups/edit-group/:groupId/:groupName',
        loadChildren: () =>
          import(
            './views/devices/devices-groups/devices-edit-group/devices-edit-group.module'
          ).then(el => el.DevicesEditGroupsRoutingModule),
      },
      {
        path: 'runload',
        loadChildren: () =>
          import('./views/batch-load/batch-load.module').then(
            el => el.BatchLoadModule,
          ),
      },
      {
        path: 'things',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import('./views/things/things.module').then(el => el.ThingsModule),
      },
      {
        path: 'equipments',
        component: DetectorsComponent,
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
      },
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            el => el.DashboardModule,
          ),
      },
      {
        path: 'history-load',
        canActivate: [RoleGuard],
        data: {
          expectedRoles: [
            Role.BusinessSecurityAnalyst,
            Role.Consult,
            Role.ControlCenter,
            Role.Transport,
            Role.OperationalAnalyst,
            Role.Paebm,
            Role.Facilities,
            Role.OtherAreas,
            Role.Admin,
            Role.Euc,
          ],
        },
        loadChildren: () =>
          import('./views/history-load/history-load.module').then(
            el => el.HistoryLoadModule,
          ),
      },
    ],
  },
  { path: 'notAuthorized', component: NotAuthorizedComponent },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
