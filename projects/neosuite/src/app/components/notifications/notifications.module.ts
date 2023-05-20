import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NotificationsComponent } from './notifications.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker'
import { TimeAgoPipe } from '../../services/time-ago.pipe';
import { FilterByEmployeePipe } from '../../helpers/filter-by-employee.pipe';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { DefaultIntlService } from '@nw-workspace/common-services';
@NgModule( {
    declarations: [NotificationsComponent, TimeAgoPipe, FilterByEmployeePipe],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        TranslateModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        OwlNativeDateTimeModule
    ],
    exports: [NotificationsComponent],
    providers: [{ provide: OwlDateTimeIntl, useClass: DefaultIntlService },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }]
} )
export class NotificationsModule {

    static entry = NotificationsComponent
}
