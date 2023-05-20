import { PipeTransform, Pipe } from '@angular/core';

@Pipe( {
    name: 'callback',
    pure: false
} )
export class CallbackPipe implements PipeTransform {

    transform( items: any, item: string ): any[] {
        if ( items ) {
            return items.filter(( listing: any ) => listing.tbMasComponents.id == item );
        }
    }
}