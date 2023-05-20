import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { EmployeeEffectiveListComponent } from './employee-effective-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: EmployeeEffectiveListComponent
    }
  
  ];
@NgModule({
    declarations: [EmployeeEffectiveListComponent],
    bootstrap: [EmployeeEffectiveListComponent],
    exports: [EmployeeEffectiveListComponent, RouterModule],
    imports: [
        HttpClientModule,
        NgSelectModule,
        CommonModule,
        UniversalListViewModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}
    ]
})

export class EmployeeEffectiveListModule { }
