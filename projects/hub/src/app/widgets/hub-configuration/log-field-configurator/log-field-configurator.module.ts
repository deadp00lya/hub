import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { LogFieldConfiguratorComponent } from './log-field-configurator.component';

@NgModule({
    declarations: [LogFieldConfiguratorComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        TranslateModule,
        UniversalListViewModule,
        NgSelectModule
    ],
    exports: [LogFieldConfiguratorComponent]
})

export class LogFieldConfiguratorModule { }
