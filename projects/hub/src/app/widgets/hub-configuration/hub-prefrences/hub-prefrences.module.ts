import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubPrefrencesComponent } from './hub-prefrences.component';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ApiMapModule } from '../api-map/api-map.module';
import { EventLogConfigurationModule } from '../event-log-configuration/event-log-configuration.module';
import { PexEventModule } from '../event/hub-event/hub-event.module';
import { PexRoleModule } from '../hub-role/hub-role.module';
import { HubRoutineModule } from '../hub-routine/hub-routine.module';
import { SeriesModule } from '../id-generation/series/series.module';
import { HubListModule } from '../list/hub-list/hub-list.module';
import { LogFieldConfiguratorModule } from '../log-field-configurator/log-field-configurator.module';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
    {
      path: '**', component: HubPrefrencesComponent
    }
  
  ];
@NgModule({
    declarations: [HubPrefrencesComponent],
    bootstrap: [HubPrefrencesComponent],
    imports: [
        CommonModule,
        FormsModule,
        PexEventModule,
        SeriesModule,
        PexRoleModule,
        HubListModule,
        ActionLogModule,
        ApiMapModule,
        LogFieldConfiguratorModule,
        LoaderModule, HubRoutineModule, EventLogConfigurationModule,
        RouterModule.forChild(routes)

    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}
        ],
    exports: [RouterModule]

})
export class HubPrefrencesModule { }
