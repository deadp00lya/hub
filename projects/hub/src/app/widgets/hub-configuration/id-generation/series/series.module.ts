import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesComponent } from './series.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { LoaderModule } from 'projects/hub/src/app/templates/loader/loader.module';
import { NeoConfigViewModule } from '../../neo-config-view/neo-config-view.module';
import { ErrorInterceptorService } from '@nw-workspace/common-services';

@NgModule({
    declarations: [SeriesComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        UniversalListViewModule,
        LoaderModule,
        NeoConfigViewModule
    ],
    bootstrap: [SeriesComponent],
    exports: [SeriesComponent]
    

})
export class SeriesModule { }
