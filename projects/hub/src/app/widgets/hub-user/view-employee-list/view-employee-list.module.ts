import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Ng2CompleterModule } from "ng2-completer";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { UpdateTemplateModule } from '../update-template/update-template.module';
import { ViewEmployeeListComponent } from './view-employee-list.component';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { AdvanceFilterListModule } from '../advance-filter-list/advance-filter-list.module';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '', component: ViewEmployeeListComponent
    }
  
  ];
@NgModule( {
    declarations: [ViewEmployeeListComponent],
    bootstrap: [ViewEmployeeListComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        UpdateTemplateModule,
        LoaderModule,
        Ng2CompleterModule,
        TranslateModule,
        AdvanceFilterListModule,
        UniversalListViewModule,
        RouterModule.forChild(routes)
    ],
    exports: [ViewEmployeeListComponent, RouterModule],
    providers:[{ provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}]
} )
export class ViewEmployeeListModule { }
