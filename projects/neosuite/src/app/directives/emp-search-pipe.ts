import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: 'SearchPipe',
    pure: false
} )
export class EmpSearchPipe implements PipeTransform {
    transform( items: any[], criteria: any ): any {
        if ( criteria == "" || criteria == undefined )
            return items;
        return items.filter( item => {

            if ( ( "" + item["userName"] ).toLocaleLowerCase().includes( criteria.toLocaleLowerCase() ) ) {
                return true;
            } else if ( ( "" + item["firstName"] ).toLocaleLowerCase().includes( criteria.toLocaleLowerCase() ) ) {
                return true;
            } else if ( ( "" + item["lastName"] ).toLocaleLowerCase().includes( criteria.toLocaleLowerCase() ) ) {
                return true;
            } else
                return false;
        } );
    }
}
