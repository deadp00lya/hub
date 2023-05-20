import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { HostUrlComponent } from './host-url.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: HostUrlComponent
    }
  
  ];
@NgModule( {
    declarations: [HostUrlComponent],
    bootstrap: [HostUrlComponent],
    imports: [
        CommonModule,
        FormsModule,
        UniversalListViewModule,
        RouterModule.forChild(routes)
    ], 
    exports: [HostUrlComponent, RouterModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}]

} )

export class HostUrlModule { }
