import { Injectable } from "@angular/core";

@Injectable()
export class SessionService {

    private currentUser: any;

    public getCurrentUser() {

        return this.currentUser;
    }

    public setCurrentUser( tempCurrentUser ) {


        this.currentUser = tempCurrentUser;
    }
    public removeCurrentUser() {

        this.currentUser = null;
    }

}