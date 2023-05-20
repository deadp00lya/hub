import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription ,timer} from "rxjs";

var time;
declare var $: any;

@Injectable( {
    providedIn: 'root'
} )
export class IdleTimeOutSrvice {
    public sessionTimeOut: Subject<any> = new Subject<any>();
    public countDownStart: Subject<any> = new Subject<any>();
    private timer: Observable<number>;
    private OutTime: Subscription;
    starttimeOut() {
        this.timer = timer(1200000 )
        this.OutTime = this.timer.subscribe( n => {
            this.sessionTimeOut.next( true );
        } );

    }

    resetTimeOut() {
        if ( this.OutTime ) {
            this.OutTime.unsubscribe()
        }
        this.starttimeOut();
    }

    checkIfSessionExpired() {
        return this.sessionTimeOut.asObservable();
    }

}
