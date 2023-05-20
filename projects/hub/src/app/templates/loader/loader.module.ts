import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { Ng2CompleterModule } from "ng2-completer";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LoaderComponent } from "../loader/loader.component";
import { FormsModule } from '@angular/forms';

@NgModule( {
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        Ng2CompleterModule,
        TranslateModule
    ],
    exports: [LoaderComponent],

    declarations: [LoaderComponent]
} )
export class LoaderModule { }
