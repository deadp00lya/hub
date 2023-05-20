import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubApprovalListComponent } from './hub-approval-list.component';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Ng2CompleterModule } from "ng2-completer";
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { LoaderModule } from 'projects/hub/src/app/templates/loader/loader.module';
import { HubApprovalModule } from '../hub-approval/hub-approval.module';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ReportInterceptor } from 'projects/hub/src/app/services/report.interceptor';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '', component: HubApprovalListComponent
    }
  
  ];
@NgModule({
    declarations: [HubApprovalListComponent],
    bootstrap: [HubApprovalListComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        Ng2CompleterModule,
        TranslateModule,
        LoaderModule,
        Ng2SearchPipeModule,
        HubApprovalModule,
        UniversalListViewModule,
        RouterModule.forChild(routes)
    ],
    exports: [HubApprovalListComponent, RouterModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}
    ]
})
export class HubApprovalListModule { }
