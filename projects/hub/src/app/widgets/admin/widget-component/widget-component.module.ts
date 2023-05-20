import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { WidgetComponentComponent } from './widget-component.component';
import { NeoConfigViewModule } from '../../hub-configuration/neo-config-view/neo-config-view.module';
import { ReportInterceptor } from '../../../services/report.interceptor';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: '', component: WidgetComponentComponent
    }
  
  ];
@NgModule( {
    declarations: [WidgetComponentComponent],
    bootstrap:[WidgetComponentComponent],
    imports: [
        CommonModule,
        FormsModule,
        LoaderModule,
        UniversalListViewModule,
        NeoConfigViewModule,
        RouterModule.forChild(routes)
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}

    ],
    exports: [RouterModule]
} )
export class WidgetComponentModule { }
