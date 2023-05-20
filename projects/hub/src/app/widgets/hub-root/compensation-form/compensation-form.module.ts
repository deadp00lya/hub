import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { FormTemplateModule } from '@nw-workspace/input-form';
import { CompensationFormComponent } from "./compensation-form.component";
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: CompensationFormComponent
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
        FormTemplateModule,
        RouterModule.forChild(routes)
    ],
    bootstrap: [CompensationFormComponent],
    declarations: [CompensationFormComponent],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}],
    exports: [RouterModule]

})

export class CompensationFormModule { }
