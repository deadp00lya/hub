import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'searchWidget'
} )
/* ***********************************************
 * Used to search widget or apps in advanced UI 
 * ***********************************************/
export class SearchWidgetPipe implements PipeTransform {

    transform( items: any[], searchText: string ): any[] {

        if ( !items ) return [];
        if ( !searchText ) return items;

        searchText = searchText.toLowerCase();

        return items.filter( item => {
            return item.name.toLowerCase().includes( searchText );
        } );
    }

}
