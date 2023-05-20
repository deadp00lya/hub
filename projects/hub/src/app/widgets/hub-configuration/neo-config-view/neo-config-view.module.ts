import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeoConfigViewComponent } from './neo-config-view.component';



@NgModule({
  declarations: [
    NeoConfigViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [NeoConfigViewComponent],
})
export class NeoConfigViewModule { }
