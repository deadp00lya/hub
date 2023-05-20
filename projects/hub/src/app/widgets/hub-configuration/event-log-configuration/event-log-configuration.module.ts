import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { EventLogConfigurationComponent } from './event-log-configuration.component';
import { NeoConfigViewModule } from '../neo-config-view/neo-config-view.module';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        TranslateModule,
        UniversalListViewModule,
        NgSelectModule,
        NeoConfigViewModule
    ],

    declarations: [EventLogConfigurationComponent],
    bootstrap: [EventLogConfigurationComponent],
    exports: [EventLogConfigurationComponent],
})

export class EventLogConfigurationModule { }
