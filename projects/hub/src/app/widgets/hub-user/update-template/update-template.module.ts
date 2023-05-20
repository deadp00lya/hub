import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2CompleterModule } from "ng2-completer";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { UpdateTemplateComponent } from './update-template.component';
import { FormTemplateModule } from '@nw-workspace/input-form';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { ReportInterceptor } from '../../../services/report.interceptor';

@NgModule({
    declarations: [UpdateTemplateComponent],
    bootstrap: [UpdateTemplateComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        FormsModule,
        LoaderModule,
        Ng2CompleterModule,
        TranslateModule,
        FormTemplateModule,
        ReactiveFormsModule
    ],
    exports: [UpdateTemplateComponent]

})
export class UpdateTemplateModule { }
