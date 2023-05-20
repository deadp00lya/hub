import { Pipe, PipeTransform } from '@angular/core';

@Pipe( { name: 'SortWidget' } )

export class SortWidget implements PipeTransform {

    transform( records: Array<any>, args?: any ): any {

        return records.sort( function( a, b ) {

            return ( a.widgetPositionY - b.widgetPositionY ) || ( a.widgetPositionX - b.widgetPositionX );
        } );
    };
}