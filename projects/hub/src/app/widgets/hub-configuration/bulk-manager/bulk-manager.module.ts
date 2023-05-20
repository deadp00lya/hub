import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { BulkManagerComponent } from './bulk-manager.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: BulkManagerComponent
    }
  
  ];
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        TranslateModule,
        UniversalListViewModule,
        NgSelectModule,
        RouterModule.forChild(routes)
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}]
    , declarations: [BulkManagerComponent],
    bootstrap: [BulkManagerComponent],
    exports: [BulkManagerComponent, RouterModule],
})

export class BulkManagerModule { }
