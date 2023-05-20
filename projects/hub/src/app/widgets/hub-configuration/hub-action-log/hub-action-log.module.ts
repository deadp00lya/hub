import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { HubActionLogComponent } from './hub-action-log.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: HubActionLogComponent
    }
  
  ];
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        TranslateModule,
        UniversalListViewModule,
        NgSelectModule,
        RouterModule.forChild(routes)
    ],
    declarations: [HubActionLogComponent],
    bootstrap: [HubActionLogComponent],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}],
    exports: [RouterModule]
})

export class HubActionLogModule { }
