import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { Ng2CompleterModule } from "ng2-completer";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { FormTemplateModule } from '@nw-workspace/input-form';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { EmployeeProfileComponent } from './employee-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: EmployeeProfileComponent
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
        Ng2CompleterModule,
        FormTemplateModule,
        LoaderModule,
        RouterModule.forChild(routes)
    ],
    exports: [EmployeeProfileComponent, RouterModule],
    declarations: [EmployeeProfileComponent],
    bootstrap: [EmployeeProfileComponent],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}
    ]
})

export class EmployeeProfileModule { }
