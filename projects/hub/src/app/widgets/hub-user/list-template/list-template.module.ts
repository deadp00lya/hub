import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ListTemplateComponent } from './list-template.component';
import { ErrorInterceptorService } from '@nw-workspace/common-services';
import { UniversalListViewModule } from '@nw-workspace/universal-list-view';
import { LoaderModule } from '../../../templates/loader/loader.module';
import { UpdateTemplateModule } from '../update-template/update-template.module';
import { RouterModule, Routes } from '@angular/router';
import { ReportInterceptor } from '../../../services/report.interceptor';

const routes: Routes = [
  {
    path: '**', component: ListTemplateComponent
  },


];
@NgModule({
  declarations: [ListTemplateComponent],
  bootstrap: [ListTemplateComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    UpdateTemplateModule,
    LoaderModule,
    TranslateModule,
    UniversalListViewModule,
    RouterModule.forChild(routes)
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ReportInterceptor, multi: true}],
  exports: [RouterModule]
})
export class ListTemplateModule { }
