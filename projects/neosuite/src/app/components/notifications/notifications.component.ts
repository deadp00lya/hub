import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WidgetService, SessionService, ToastService, UtilityService } from "@nw-workspace/common-services";
import { NotifyService } from "../../services/notify.service";
import { WidgetDTO } from "../../models/WidgetDTO";
import { HttpClient } from "@angular/common/http";
import { ApplicationDTO } from "../../models/ApplicationDTO";
import * as M from "materialize-css/dist/js/materialize";
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from "@angular/router";
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

declare var $: any
@Component( {
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
} )
export class NotificationsComponent implements OnInit, AfterViewInit {
    currentUser: any;
    applications: ApplicationDTO[] = [];
    allMyWidgets: WidgetDTO[] = [];
    apps = new Set<string>()
    widgets: WidgetDTO[] = [];
    selected: any
    all_notification: boolean = true;
    componentName: string = "Unread"
    notifications = new Map();
    selectedApplication: string = "allnotifications";
    currentApp = new Map();
    currentNotif = new Map();
    archivedNotifications = null
    archivedNotif = new Map();
    notificationcount: number = 0;
    searchKey: string
    notified: boolean = false;
    customdate: boolean = false;
    todayDate: boolean = false;
    yesterdayDate: boolean = false;
    lastweek: boolean = false;
    newestOldest: String = "newest";
    startDate: Date;
    endDate: Date;
    today = new Date();
    yesterday = new Date( new Date().setDate( new Date().getDate() - 1 ) );
    lastWeek1 = new Date( new Date().setDate( new Date().getDate() - 14 ) );
    lastWeek2 = new Date( new Date().setDate( new Date().getDate() - 7 ) );
    loginUser: string;
    language: string;
    constructor( private http: HttpClient, private widgetService: WidgetService, private notifyService: NotifyService, private sessionService: SessionService, private translate: TranslateService,
        private utilityService: UtilityService, private router: Router, private toastService: ToastService, private dateTimeAdapter: DateTimeAdapter<any> ) {
    }

    ngOnInit() {
        this.currentUser = this.sessionService.getCurrentUser();
        this.language = this.currentUser.additionalDetails.mdm.preferredLang;
        if ( this.language != null &&  this.language !='null')
            this.dateTimeAdapter.setLocale( this.language );

        this.loginUser = this.currentUser.additionalDetails.employeeId
        this.widgetService.currentWidgets.subscribe( widgets => {

            this.widgets = widgets;
            this.widgets.forEach( item => {

                if ( !this.applications.find( function( app ) {
                    app.notificationCount = 0
                    return app.appName == item.application.appName
                } ) ) {
                    this.applications.push( item.application );
                }

            } )
            $( '.chips' ).chips();

        } )

        $( '.chips' ).chips();

        this.notifyService.subscribeNotifications().subscribe( notifs => {
            var notifications = [];
            this.widgetService.currentWidgets.subscribe( widgets => {
                this.allMyWidgets = widgets;
                notifs.forEach( n => {
                    var list = [];
                    list = this.allMyWidgets.filter( w => n.app == w.application.appCode );
                    if ( list.length != 0 )
                        notifications.push( n )
                } )
            } )
            this.pushNotifications( notifications )
            this.getCurrentAppNotifications( this.selectedApplication )
        } )
    }

    ngAfterViewInit() {

    }

    pushNotifications( notifs ) {
        this.notifications = new Map()
        this.notificationcount = notifs.length;
        let keys = new Set<string>()
        this.applications.filter( app => {
            keys.add( app.appCode )
        } )

        keys.forEach( app => {
            let notificationList = []
            notifs.filter( notify => {
                if ( app.toLowerCase() == notify.app.toLowerCase() ) {
                    notificationList.push( notify )
                    notificationList[0].total_notifications += 1
                }
            } )

            if ( notificationList.length != 0 )
                this.notifications.set( app, notificationList )
        } )

        this.currentApp = this.notifications
        this.applications.filter( app => {
            let count: any[] = this.currentApp.get( app.appCode )
            if ( count != undefined && count != null )
                app.notificationCount = count.length
            else
                app.notificationCount = 0
        } )

    }


    //define your method
    currentAppNotification( app ) {
        if ( app != null || app != undefined ) {
            this.selectedApplication = app;
            if ( this.componentName.toLowerCase() == "unread" )
                this.getCurrentAppNotifications( app );
            else
                this.getArchivedNotifications()
        }

    }
    getNotificationsForUser() {

        this.currentAppNotification( this.selectedApplication )
        this.resetFilter()
    }

    markedNotificationRead( index, id, app ) {
        this.notifyService.removeNotifById( id )
    }

    getCurrentAppNotifications( app: string ) {

        if ( this.notifications != null && this.notifications.size != 0 ) {
            if ( app == "allnotifications" )
                this.currentApp = this.notifications
            else {
                let appNot: any = this.notifications.get( app )
                if ( appNot != undefined ) {
                    this.currentApp = new Map();
                    this.currentApp.set( app, appNot )
                } else {
                    this.currentApp = null;
                }

            }
            this.currentNotif = this.currentApp;
            this.SortByOldestAndNewst( "newest" )

        } else {
            this.currentApp = null;
        }

    }

    getArchivedNotifications() {

        this.http.get<any>( "neosuite/api/getAllArchivedNotifications?app=" + this.selectedApplication ).subscribe( data => {
            if ( data.payload != null && data.payload != [] && data.payload.length != 0 ) {

                this.archivedNotifications = new Map()
                let notes: any[] = data.payload;

                let keys = new Set<string>()
                this.applications.filter( app => {
                    keys.add( app.appCode )
                } )

                keys.forEach( app => {
                    let notificationList = []
                    notes.filter( notify => {
                        if ( app.toLowerCase() == notify.app.toLowerCase() ) {
                            notificationList.push( notify )

                        }
                    } )
                    if ( notificationList.length != 0 )
                        this.archivedNotifications.set( app, notificationList )
                    this.archivedNotif = this.archivedNotifications
                    this.SortByOldestAndNewst( "newest" )
                } )

            } else
                this.archivedNotifications = null


        } )
    }


    clearAllNotifications() {
        if ( this.notificationcount == 0 ) {
            let foo: any = this.translate.get( "You dont have any notification." );
            foo.subscribe( data => alert( data ) );
        }
        else {
            let result: any;
            let foo: any = this.translate.get( "Do you want to clear all notifications?" );
            foo.subscribe( data => result = confirm( data ) )
            if ( result ) {
                var notifs = [];
                this.currentApp.forEach(( v, k ) => {
                    v.forEach( notif => {
                        notifs.push( notif )
                    } )
                } )
                this.notifyService.removeAll( notifs )
            }
        }
    }
    isEmptyObject( obj ) {
        return ( obj && ( Object.keys( obj ).length === 0 ) );
    }

    SortByOldestAndNewst( sortingType: string ) {
        let sortedmap = new Map()
        var apps: any
        if ( this.componentName == 'Unread' )
            apps = this.currentApp;
        if ( this.componentName == 'Archived' )
            apps = this.archivedNotifications;
        if ( apps != null ) {
            apps.forEach(( value, key ) => {
                var sort = value.sort( function( a, b ) {
                    var d1 = new Date( a.createdOn );
                    var d2 = new Date( b.createdOn );
                    if ( sortingType == "oldest" )
                        return ( d1 > d2 ) ? 1 : ( ( d1 < d2 ) ? -1 : 0 )

                    if ( sortingType == "newest" )
                        return ( d1 < d2 ) ? 1 : ( ( d1 > d2 ) ? -1 : 0 )
                } )
                sortedmap.set( key, sort )
            } )
            if ( this.componentName == 'Unread' )
                this.currentApp = sortedmap;
            if ( this.componentName == 'Archived' )
                this.archivedNotifications = sortedmap;
        }
    }

    sortByDate( sortDate: string ) {
        var apps: any
        if ( this.componentName == 'Unread' )
            apps = this.currentNotif;
        if ( this.componentName == 'Archived' )
            apps = this.archivedNotif;
        let sortedmap = new Map()
        this.getCurrentAppNotifications( this.selectedApplication )
        switch ( sortDate ) {
            case 'dateRange': {
                if ( this.startDate == null ) {
                    this.toastService.warning( "Please select start date" );
                    return;
                }
                var startDate = new Date( this.startDate.getFullYear() + "/" + this.startDate.getMonth() + "/" + this.startDate.getDate() );
                if ( this.endDate == null ) {
                    this.toastService.warning( "Please select end date" );
                    return;
                }
                var endDate = new Date( this.endDate.getFullYear() + "/" + this.endDate.getMonth() + "/" + this.endDate.getDate() );
                break;
            }
            case 'today': {
                this.todayDate = !this.todayDate;
                if ( this.todayDate == false ) {
                    this.getCurrentAppNotifications( this.selectedApplication )
                    return 0;
                }
                this.lastweek = this.yesterdayDate = this.customdate = false;
                var startDate = new Date( this.today.getFullYear() + "/" + this.today.getMonth() + "/" + this.today.getDate() );
                var endDate = startDate;
                break;
            }
            case 'yesterday': {
                this.yesterdayDate = !this.yesterdayDate
                if ( this.yesterdayDate == false ) {
                    this.getCurrentAppNotifications( this.selectedApplication )
                    return 0;
                }
                this.todayDate = this.lastweek = this.customdate = false;
                var startDate = new Date( this.yesterday.getFullYear() + "/" + this.yesterday.getMonth() + "/" + this.yesterday.getDate() );
                var endDate = startDate;
                break;
            }

            case 'lastWeek': {
                this.lastweek = !this.lastweek;
                if ( this.lastweek == false ) {
                    this.getCurrentAppNotifications( this.selectedApplication )
                    return 0;
                }
                this.todayDate = this.yesterdayDate = this.customdate = false;
                var startDate = new Date( this.lastWeek1.getFullYear() + "/" + this.lastWeek1.getMonth() + "/" + this.lastWeek1.getDate() );
                var endDate = new Date( this.lastWeek2.getFullYear() + "/" + this.lastWeek2.getMonth() + "/" + this.lastWeek2.getDate() );
                break;
            }
        }

        if ( apps != null ) {
            apps.forEach(( value, key ) => {
                let sort = []
                value.forEach( notif => {
                    var createdDate = new Date( notif.createdOn );
                    var createDate = new Date( createdDate.getFullYear() + "/" + createdDate.getMonth() + "/" + createdDate.getDate() );
                    if ( createDate >= startDate && createDate <= endDate ) {
                        sort.push( notif )
                    }
                } )
                if ( sort.length != 0 )
                    sortedmap.set( key, sort )
            } );
            if ( this.componentName == 'Unread' )
                this.currentApp = sortedmap
            if ( this.componentName == 'Archived' )
                this.archivedNotifications = sortedmap;
        }
    }

    resetFilter() {
        this.todayDate = false
        this.yesterdayDate = false
        this.lastweek = false
        this.customdate = false
    }

    resetDate() {
        this.resetFilter();
        this.newestOldest = "newest";
        this.startDate = null;
        this.endDate = null;
        this.getCurrentAppNotifications( this.selectedApplication )
        this.archivedNotifications = this.archivedNotif
    }

    openFilterDropdown() {
        let filterEle: Element = document.getElementById( "filterDateDropdown" )
        var instanceFilterDrop = new M.Dropdown( filterEle, {
            coverTrigger: false, 'alignment': 'right', closeOnClick: false, 'onCloseStart': function( e ) {
                e.stopPropagation();
            }
        } );
        instanceFilterDrop.open();
    }

    closeFilterDropdown() {

        let filterEle: Element = document.getElementById( "filterDateDropdown" )
        var instanceFilterDrop = new M.Dropdown( filterEle, {} );
        instanceFilterDrop.close();
        //        this.resetDate();

    }

    notifToWidgetLoader( url ) {
        if ( this.utilityService.isNotNullOrEmptyOrUndefined( url ) )
            this.router.navigate( ['/home/' + url] );
    }

}
