import { Injectable, OnDestroy } from '@angular/core';
import { Subject, from, Subscription } from "rxjs";

@Injectable( {
    providedIn: 'root'
} )
export class EventsService implements OnDestroy {
    constructor() {
        this.listeners = {};
        this.eventsSubject = new Subject();

        this.events = from(this.eventsSubject);

        this.subscription = this.events.subscribe(
            ({name, args}) => {
                console.log("Event Subscribed");
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }
    
    subscription: Subscription;
    listeners = {};
    eventsSubject = new Subject();
    events: any;

    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    broadcast(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
    
    ngOnDestroy() {
        console.log("Event Unsubscribed");
        this.subscription.unsubscribe();
    }
}