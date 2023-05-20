import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general/general.component';
import { ProxyComponent } from './proxy/proxy.component';
import { SettingsComponent } from './settings.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];
@NgModule({
  declarations: [SettingsComponent, GeneralComponent, ProxyComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  exports: [SettingsComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
})
export class SettingsModule {
  static entry = SettingsComponent;
}
