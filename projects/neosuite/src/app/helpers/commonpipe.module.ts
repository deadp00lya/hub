import { NgModule } from '@angular/core';
import { OrderByPipe } from './orderByPipe';
import { OrderrBy } from './orderby';
@NgModule( {
    declarations: [OrderByPipe, OrderrBy],
    exports: [OrderByPipe, OrderrBy]
} )
export class CommonPipeModule {}