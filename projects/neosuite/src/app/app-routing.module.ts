import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsAuthGuard } from './apps-auth.guard';
import { AuthGuard } from './auth.guard';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { AdvancedHomeComponent } from './components/advanced-home/advanced-home.component';
import { FavouriteWidgetComponent } from './components/favourite-widget/favourite-widget.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdvancedHomeLayoutComponent } from './components/advanced-home-layout/advanced-home-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AnnoucementsComponent } from './components/annoucements/annoucements.component';
import { remoteRoutes } from './ComponentStore';

const routes: Routes = [
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'not-found', component: NotFoundComponent },
  {
    path: '',
    component: AdvancedHomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      ...[
        { path: 'annoucements', component: AnnoucementsComponent },
        {
          path: 'favourite',
          component: FavouriteWidgetComponent,
        },
        {
          path: 'home',
          component: AdvancedHomeComponent,
          data: { roles: ['ADMIN', 'USER'] },
        },
        {
          path: 'delegations',
          loadChildren: () =>
            import('./components/delegate/delegate.module').then(
              (m) => m.DelegateModule
            ),
        },
        {
          path: 'settings',
          loadChildren: () =>
            import('./components/settings/settings.module').then(
              (m) => m.SettingsModule
            ),
        },
      ],
      ...remoteRoutes,
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
