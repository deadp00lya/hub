import { Pipe, PipeTransform } from '@angular/core';
import { WidgetDTO } from "../models/WidgetDTO";

@Pipe( {
    name: 'isVisible'
} )
export class IsVisiblePipe implements PipeTransform {

    transform( items: any[] ): any[] {
        if ( items ) {
            return items.filter( item => {

                if ( item.visible  )
                    return true;
                
                return false;
                //                return item.visible == true;
            } );
        }
    }

}
