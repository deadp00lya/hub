import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { OrgConfigModule } from '../org-config/org-config.module';
import { OrgRoleConfigModule } from '../org-role-config/org-role-config.module';
import { OrgPreferencesComponent } from './org-preferences.component';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: OrgPreferencesComponent
    }
  
  ];
@NgModule({
    declarations: [OrgPreferencesComponent],
    bootstrap: [OrgPreferencesComponent],
    imports: [
        CommonModule,
        OrgRoleConfigModule,
        OrgConfigModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}],
    exports: [RouterModule]
})

export class OrgPreferencesModule { }
