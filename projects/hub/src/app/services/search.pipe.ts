import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'search'
} )
export class SearchPipe implements PipeTransform {

    transform( value: any, args?: string ): any {
        
        if ( args === undefined || args == '' ) {
            return value;
        }else{
            args = args.toUpperCase();  
        }
        return value.filter( it => {
            return it.toUpperCase().includes( args );
        } )

    }

}
