import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelegateComponent } from "../../components/delegate/delegate.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Ng2CompleterModule } from "ng2-completer";
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker'
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { DefaultIntlService } from '@nw-workspace/common-services';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
      path: '',
      component: DelegateComponent
    }
  ];
@NgModule( {
    declarations: [DelegateComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        Ng2CompleterModule,
        TranslateModule,
        NgSelectModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        RouterModule.forChild(routes)
        
    ],
    exports: [DelegateComponent],
    providers: [{ provide: OwlDateTimeIntl, useClass: DefaultIntlService }, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }]
} )
export class DelegateModule {
    static entry = DelegateComponent
}
