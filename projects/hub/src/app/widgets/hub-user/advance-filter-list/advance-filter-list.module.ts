import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { Ng2CompleterModule } from "ng2-completer";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { OwlNativeDateTimeModule, OwlDateTimeModule, OwlDateTimeIntl, OWL_DATE_TIME_LOCALE } from "@danielmoncada/angular-datetime-picker";
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AdvanceFilterListComponent } from './advance-filter-list.component';
import { ErrorInterceptorService } from '@nw-workspace/common-services';


@NgModule({
  declarations: [AdvanceFilterListComponent],
  imports: [
    CommonModule,
    OwlDateTimeModule,
    HttpClientModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule,
    Ng2CompleterModule,
    NgSelectModule,
  ], exports: [AdvanceFilterListComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ]


})
export class AdvanceFilterListModule { static entry = AdvanceFilterListComponent }
