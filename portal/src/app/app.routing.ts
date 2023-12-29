import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalRedirectComponent } from '@azure/msal-angular';
import { MainComponent } from './components/presentational/main/main.component';
import { ForbiddenPage } from './pages/forbidden/forbidden.page';

const routes: Routes = [
  {
    path: 'forbidden',
    component: ForbiddenPage
  },
  {
    // Needed for handling redirect after login
    path: 'auth',
    component: MsalRedirectComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.module').then(m => m.PagesModule),
        data: { title: '', pageTitle: '' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
