import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { Ng2CompleterModule } from "ng2-completer";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { CreateEmployeeComponent } from './create-employee.component';
import { RouterModule, Routes } from '@angular/router';
import { CreateTemplateModule } from '../create-template/create-template.module';
import { CreateTemplateComponent } from '../create-template/create-template.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
  {
    path: '', component: CreateEmployeeComponent,
    
  }
];
@NgModule({
  declarations: [
    CreateEmployeeComponent
    
  ],
  bootstrap: [CreateEmployeeComponent],
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
  
    RouterModule.forChild(routes)
  ],
  exports: [CreateEmployeeComponent, RouterModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }, DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true }]
})
export class CreateEmployeeModule { }
