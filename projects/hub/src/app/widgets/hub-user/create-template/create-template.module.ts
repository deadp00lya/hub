import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Ng2CompleterModule } from "ng2-completer";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CreateTemplateComponent } from './create-template.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { FormTemplateModule } from '@nw-workspace/input-form';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '**', component: CreateTemplateComponent
    }
  
  ];
@NgModule({
    declarations: [CreateTemplateComponent],
    bootstrap: [CreateTemplateComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        Ng2CompleterModule,
        TranslateModule,
        LoaderModule,
        NgSelectModule,
        FormTemplateModule,
        RouterModule.forChild(routes)

    ],
    exports: [CreateTemplateComponent, RouterModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true }],
})
export class CreateTemplateModule { }
