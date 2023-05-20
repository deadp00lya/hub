import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
    name: 'filterByEmployee'
} )
export class FilterByEmployeePipe implements PipeTransform {

    transform( currentApp: any, searchKey: any ): any {

        if ( !currentApp || !searchKey ) {
            return currentApp;
        }
        let userApp = currentApp.keys();
        let userNotif = currentApp.values()
        let entry = currentApp.entries();
        let userNotifications = new Map();
        currentApp.forEach(( value, key ) => {

            let userdata: any[] = []
            value.forEach( user => {
                let empId: string = user.fromUser.toLowerCase().trim()
                //let empName: string = user.empName.toLowerCase().trim()
                //if ( empId.includes( searchKey.toLowerCase().trim() ) || empName.includes( searchKey.toLowerCase().trim() ) )
                if ( empId.includes( searchKey.toLowerCase().trim() ))
                    userdata.push( user )
            } )
            if ( userdata.length != 0 )
                userNotifications.set( key, userdata )

        } )

        return userNotifications;
    }
}
