import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { WidgetService } from "@nw-workspace/common-services";
import * as M from 'materialize-css/dist/js/materialize';
import { HttpClient } from '@angular/common/http';
import { RemoteData, CompleterService } from 'ng2-completer';
import {  CompleterData,  CompleterItem } from 'ng2-completer';
import { ProxySettingDTO } from '../../models/ProxySettingDTO';
import { UserDTO } from '../../models/userDTO';
import { WidgetDTO } from '../../models/WidgetDTO';
import { ProfileImageLoaderService } from '../../services/profile-image-loader.service';
import { ToastService } from '@nw-workspace/common-services';
import { SessionService, UtilityService } from '@nw-workspace/common-services';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

declare var $: any;
@Component( {
    selector: 'app-delegate',
    templateUrl: './delegate.component.html',
    styleUrls: ['./delegate.component.css']
} )
export class DelegateComponent implements OnInit {
    loadingImg: boolean = true;
    delegatedToUSer: any;
    subComponentName: string; 
    noWidgetImg: boolean;
    dateRange: Date;
    startDate: Date;
    endDate: Date;
    popupList: any[];
    proxyDTO: ProxySettingDTO = new ProxySettingDTO();
    hideDelegate: boolean = true;
    delegateBtn: boolean = true;
    saveDelegation: boolean = true;
    showDelegate: boolean = false;
    widgetmenu: boolean = false;
    appWidget: boolean = false;
    appShow: boolean = false;
    componentName: any
    applications = [];
    userNameId: string;
    currentUser;
    tempAppModules: any[];
    widgetAppModules: any[];
    status: boolean = false;
    appWidgetMap = new Map();
    selectedAppWidget = new Map<any, WidgetDTO[]>();
    savedAppWidget = new Map<any, WidgetDTO[]>();
    currentWidget = [];
    userList: UserDTO[] = [];
    usersNameList = [];
    proxyUser: string;
    delegatedTo: string;
    delgatedToUName: string;
    delegatedBy: string;
    historyList: ProxySettingDTO[] = [];
    delegateViewFlag: boolean = false;
    history: ProxySettingDTO = new ProxySettingDTO();
    index: number;
    widgetCodes: string[] = [];
    widgetMap = new Map<string, WidgetDTO[]>();
    dataService: RemoteData;
    onMeFlag: boolean = false;
    closeBtn: boolean = true;
    openDelegate: boolean = true;
    historyTop: boolean = false;
    widgets: WidgetDTO[] = [];
    /*@Input() widgets;*/
    
    public min = new Date( new Date().setDate( new Date().getDate() - 1 ) );
    delegationList: boolean = false;
    profileImg : string ;
    proxyUserImg : string ;
    language: string;
    constructor( private sessionService: SessionService, private http: HttpClient, private utilityService: UtilityService
        , private toastService: ToastService, private completerService: CompleterService, private profileImageLoaderService: ProfileImageLoaderService, private dateTimeAdapter: DateTimeAdapter<any> ) {

        //this.componentName = 'Delegate';
        this.componentName = 'Delegations';

       // this.dataService = completerService.remote( "neosuite/api/fetchDelegateUserList?userName=", "employeeId,firstName,lastName", "employeeId,firstName,lastName" );

    }
    ngAfterViewInit() {
    }
    ngOnInit() {
        this.currentUser = this.sessionService.getCurrentUser();
        this.language = this.currentUser.additionalDetails.mdm.preferredLang;
        if ( this.language != null  &&  this.language !='null')
            this.dateTimeAdapter.setLocale( this.language );

        this.subComponentName = 'OnMe';
        this.delegationsComponent();
        //        this.selectedAppWidget.clear();
        this.applications = [];
        this.showWidgetGrid();
    }

    selectWidget( event: any, widget: any, app: any ) {
        var widgets = [];
        this.widgetAppModules = this.filterAppModules( app );
        this.widgetAppModules.forEach( widgetObj => {


            let filterW = this.filterWidgets( widgetObj )
            filterW.forEach( w => {
                widgets.push( w );
            } );
        } );
        var widList = []
        widgets.forEach(( wid ) => {
            if ( wid.widgetName == widget.widgetName ) {
                wid.selected = !wid.selected
            }
            if ( wid.selected == true ) {
                widList.push( wid )
            }
            app.showImg = true
            app.showGif = false
            if ( this.utilityService.isNullOrEmptyOrUndefined( app.iconName ) )
                app.iconName = "assets/WidgetIcon/defaulticon.jpg"
//            if ( this.utilityService.isNullOrEmptyOrUndefined( app.gifName ) )
//                app.gifName = "assets/WidgetIcon/defaulticon.jpg"
            this.selectedAppWidget.set( app, widList )

        } );
        if ( ( !this.currentWidget.includes( widget ) && widget.selected == true ) ) {
            this.currentWidget.push( widget )
        }
        else {
            var index1 = this.currentWidget.indexOf( widget );
            delete this.currentWidget[index1];
        }
        this.selectedAppWidget.forEach(( value, key ) => {
            if ( value.length == 0 ) {
                this.selectedAppWidget.delete( key );
            }

        } );


    }
    showWidget( index ) {
        var popup = document.getElementById( "widgetPopup_" + index );
        popup.classList.toggle( "show" );

    }

    showDelegates() {
        if ( this.selectedAppWidget.size == 0 ) {
            this.toastService.error( "Select at least one widget" )
            return false;
        }
        this.closeBtn = false;
        this.delegateBtn = true;
        this.showDelegate = true;
        this.hideDelegate = false;
        this.userNameId = this.currentUser.additionalDetails.mdm.firstName
        + " " + this.currentUser.additionalDetails.mdm.lastName + "-" + this.currentUser.additionalDetails.mdm.employeeId;
        this.proxyDTO.proxiedBy.userName = this.currentUser.additionalDetails.mdm.firstName
        + " " + this.currentUser.additionalDetails.mdm.lastName;

    }


    setDelegateUser( user ) {
	if(user)
        this.delegatedToUSer=user.employeeId+user.firstName+user.lastName;
    else 
    	this.delegatedToUSer = '';   
    }
        
    fetchDelegateUserList(event) {
	
	let searchKey= event.target.value;
	if(searchKey.length>1){
        return this.http.get<any>("neosuite/api/fetchDelegateUserList?userName=" + searchKey).subscribe(data => {
            
            this.userList = data.payload;
        })
      }
    }
 
    saveDelegate() {

        if ( this.delegatevalidate() ) {

            this.proxyUser = this.proxyDTO.proxiedBy.firstName + " " + this.proxyDTO.proxiedBy.lastName;
            this.setProxyDto();
             var  date1= this.proxyDTO.startDate.getTime();
             this.proxyDTO.startDate=new Date(date1 + 19800*1000);
             var  date2= this.proxyDTO.endDate.getTime();
             this.proxyDTO.endDate= new Date(date2 + 19800*1000);
             console.log("Formated start date"+this.proxyDTO.startDate)
             console.log("Formated start date"+this.proxyDTO.endDate)
            return this.http.post<any>( 'neosuite/api/saveDelegation', this.proxyDTO )
                .subscribe( data => {

                    var response = data.payload;

                    if ( response != null ) {
                        if ( !this.utilityService.isNullOrEmptyOrUndefined( response ) && data.status == "success" ) {
                            this.saveDelegation = false;
                            this.hideDelegate = true;
                            this.savedAppWidget = this.selectedAppWidget;
                            this.startDate = this.dateRange[0];
                            this.endDate = this.dateRange[1];
                            this.delegatedBy = this.proxyDTO.proxiedBy.userName;
                            this.delegatedTo = this.delegatedToUSer;
                            this.delgatedToUName = this.proxyDTO.proxiedToUser.firstName + " " + this.proxyDTO.proxiedToUser.lastName;
                            //                            this.loadImage( response.delegatedTo, "userImage", "proxyUserImg" );
                            //                    this.loadImage( this.proxyDTO.delegatedTo, "userImage", "proxyUser_"+this.delegatedBy );
                            this.uploadProfileImage();
                        }
                    }
                } )
        }


    }
    close() {
        this.openDelegate = false;
    }

    setProxyDto() {
        var widgets = []
        var widgetCode = []
        //var delegatedTo
        /* this.userList.forEach( user => {
             if ( ( user.firstName + " " + user.lastName ) == this.delegatedToUSer ) {
                 delegatedTo = user.employeeId;
             }
         } )*/
        this.selectedAppWidget.forEach(( value, key ) => {
            widgets.push( this.selectedAppWidget.get( key ) )
        } );
        widgets.forEach( widget => {
            var i = 0
            widget.forEach( w => {
                widgetCode.push( w.widgetCode );
                i++
            } )

        } );
        this.proxyDTO.widgetCode = widgetCode;
        this.proxyDTO.startDate = this.dateRange[0];
        this.proxyDTO.endDate = this.dateRange[1];

    }


    delegateComponent() {
        this.currentWidget = [];
        this.selectedAppWidget.clear();
        this.delegateBtn = false;
        this.componentName = 'Delegate';
        this.delegateViewFlag = true;
        this.closeBtn = true;
        this.delegatedToUSer = null;
        this.dateRange = null;
        this.getMyAllWidgets();

    }

    historyComponent() {
        this.componentName = 'History';
        this.delegationList = false;
        this.subComponentName = 'ByMe';
        this.delegateViewFlag = false;
        this.byMeComponent();
        this.closeBtn = false;

    }

    showWidgetGrid() {

        this.appShow = false;
        this.appWidget = true;
    }
    showDelegateHistory() {
        this.showDelegate = false;
        this.subComponentName = 'OnMe';
        this.delegationsComponent();
        //this.onMeComponent();
    }

    filterAppModules( application ) {

        var filterdModules = [];
        this.widgets.forEach( item => {
            if ( item.application.appName == application.appName ) {
                if ( !filterdModules.find( function( module ) {

                    return module.moduleName == item.appModule.moduleName
                } ) ) {
                    filterdModules.push( item.appModule );
                }
            }
        } )

        return filterdModules;

    }


    filterWidgets( module ) {
        this.tempAppModules;
        var filterdWidgets = [];
        this.widgets.forEach( item => {
            if ( item.appModule.id == module.id ) {
                filterdWidgets.push( item );
            }
        } )
        return filterdWidgets;
    }

    fetchUserNamesForProxy( search: string ) {

        if ( search != null || search != "" || search.trim().length != 0 ) {

            var splitted = search.split( " ", 2 );
            return this.http.post<any>( 'neosuite/api/fetchUserForProxy?userName=' + splitted[0], {} )
                .subscribe( data => {
                    this.userList = data.payload;
                } )
        }
    }

    loadImage( propertyValue, propertyName, imgId ) {
        return this.http
            .get( "neosuite/api/image?propertyValue=" + propertyValue + "&propertyName=" + propertyName, { responseType: 'blob' } )
            .subscribe( data => {

                let elem = <any>document.getElementById( imgId );

                if ( window.navigator.msSaveOrOpenBlob ) { // Checking if IE
                    let reader = new FileReader();
                    let dataURL = '';
                    reader.onload = function readerFile( e ) {
                        elem.src = reader.result;
                    };
                    reader.readAsDataURL( data );
                } else {
                    elem.src = ( window.URL ).createObjectURL( data );
                }

            } );
    }

    reset() {
        this.delegatedToUSer = "";
        this.dateRange = null;
        this.proxyDTO.proxiedToUser= null;
    }
    delegatevalidate() {

        if ( !this.utilityService.isNotNullOrEmptyOrUndefined( this.delegatedToUSer ) ) {
            this.toastService.error( "Please select delegated user" );
            return false;
        }
        else if ( !this.utilityService.isNotNullOrEmptyOrUndefined( this.dateRange ) ) {
            this.toastService.error( "Please select delegation duration" );
            return false;
        }
        else
            return true;
    }

    onMeComponent() {
        this.subComponentName = 'OnMe';
        this.onMeFlag = true;

        if ( this.componentName == 'Delegations' ) {
        this.http.get<any>( 'neosuite/api/fetchOnMeList' )
            .subscribe( data => {
                this.historyList = data.payload;
                    this.filterDelegationsList();
            } )

    }
        else {
            this.onMeArchievedList();
        }
    }

    byMeComponent() {
        this.subComponentName = 'ByMe';
        this.onMeFlag = false;

        if ( this.componentName == 'Delegations' ) {
        this.http.get<any>( 'neosuite/api/fetchByMeList' )
            .subscribe( data => {
                this.historyList = data.payload;
                    this.filterDelegationsList();
            } )
    }
        else {
            this.byMeArchievedList();
        }
    }

    deleteDelegate( history, i ) {
        $( '#deleteDelegateModal' ).modal();
        this.history = history;
        /*this.widgetMap = history.widgetmap;
        for ( const [key, value] of Object.entries( this.widgetMap ) ) {
            for ( let j = 0; j < value.length; j++ ) {

                this.widgetCodes.push( value[j].widgetCode );

            }
        }*/

        this.widgetCodes = [];
        for ( let widget of this.history.widgets ) {
            //var widgetCode = 
            this.widgetCodes.push( widget.widgetCode );
        }
        this.index = i;
    }

    deleteStatus( status ) {

        if ( status == "Yes" ) {
            this.http.get<any>( 'neosuite/api/deleteDelegation?id=' + this.history.id + "&widgetCodes=" + this.widgetCodes )
                .subscribe( data => {
                    this.historyList.splice( this.index, 1 );
                    $( '#deleteDelegateModal' ).modal( 'close' );
                } );
        }
        else {
            $( '#deleteDelegateModal' ).modal( 'close' );
        }
    }

    getMyAllWidgets() {
        this.http.get<any>( "neosuite/api/getMyAllWidgets" )
            .subscribe( data => {
                this.widgets = data.payload;
                this.widgets.forEach( item => {

                    if ( !this.applications.find( function( app ) {
                        return app.appName == item.application.appName
                    } ) ) {
                        this.applications.push( item.application );
                    }

                } )
                this.applications.forEach( app => {
                    app.showImg = true
                    if ( this.utilityService.isNullOrEmptyOrUndefined( app.iconName ) )
                        app.iconName = "assets/WidgetIcon/defaulticon.jpg"
//                    if ( this.utilityService.isNullOrEmptyOrUndefined( app.gifName ) )
//                        app.gifName = "assets/WidgetIcon/defaulticon.jpg"
                    this.tempAppModules = this.filterAppModules( app )
                    var widgets = [];
                    var widgetName = []
                    this.tempAppModules.forEach( module => {
                        widgets.push( this.filterWidgets( module ) )
                        var wid;
                        wid = widgets[widgets.length - 1];
                        for ( let i = 0; i < wid.length; i++ ) {
                            widgetName.push( wid[i] );
                        }
                    } )
                    this.appWidgetMap.set( app, widgetName );
                } )
                this.widgets.forEach( data => {
                    data.selected = false;
                } );
                if(this.appWidgetMap.size!=0){
                    this.delegateBtn=false;
                    this.noWidgetImg=true;
                }
            } )
    }

    backBtn() {
        this.delegateBtn = false;
        this.showDelegate = false;
        this.hideDelegate = true;
    }

    uploadProfileImage() {
        //        this.profileImageLoaderService.loadsyncimage( this.currentUser.additionalDetails.employeeId, "userImage" );
        //        this.profileImageLoaderService.loadsyncimage( this.proxyDTO.proxiedToUser.employeeId, "proxyUserImg" );

        this.profileImg = this.profileImageLoaderService.userProfileImg
        this.profileImageLoaderService.downloadProfileImage().subscribe( res => {
            this.proxyUserImg = null;
        } );
        setTimeout(() => {
            this.loadingImg = false;
        }, 2500 );

    }

    delegationsComponent() {

        this.componentName = 'Delegations';
        this.delegationList = true;
        this.saveDelegation = true;
        this.delegateViewFlag = false;
        this.closeBtn = true;

        if ( this.subComponentName == 'OnMe' ) {
            this.onMeComponent();
        }

        if ( this.subComponentName == 'ByMe' ) {
            this.byMeComponent();
        }


    }

    onMeArchievedList() {

        if ( this.componentName == 'History' ) {
            this.http.get<any>( 'neosuite/api/fetchArchievedOnMeList' )
                .subscribe( data => {
                    this.historyList = data.payload;
                } )
        }
    }

    byMeArchievedList() {

        if ( this.componentName == 'History' ) {
            this.http.get<any>( 'neosuite/api/fetchArchievedByMeList' )
                .subscribe( data => {
                    this.historyList = data.payload;
             this.historyList.forEach( x => {
                        if ( this.utilityService.isNullOrEmptyOrUndefined( x.application.iconName ) )
                            x.application.iconName = "assets/WidgetIcon/defaulticon.jpg"
//                        if ( this.utilityService.isNullOrEmptyOrUndefined( x.application.gifName ) )
//                            x.application.gifName = "assets/WidgetIcon/defaulticon.jpg"
                    } )
                } )
        }
    }

    filterDelegationsList() {

        let list = [];
        if ( Array.isArray(this.historyList) && this.historyList.length) {
            this.historyList.forEach( x => {

                let strtDate = new Date( new Date( x.startDate ).getFullYear(), new Date( x.startDate ).getMonth(), new Date( x.startDate ).getDate() );
                let endDate = new Date( new Date( x.endDate ).getFullYear(), new Date( x.endDate ).getMonth(), new Date( x.endDate ).getDate() );
                let today = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() )
                let same = new Date().getTime() === new Date( x.endDate ).getTime();
                if ( this.utilityService.isNullOrEmptyOrUndefined( x.application.iconName ) )
                    x.application.iconName = "assets/WidgetIcon/defaulticon.jpg"
//                if ( this.utilityService.isNullOrEmptyOrUndefined( x.application.gifName ) )
//                    x.application.gifName = "assets/WidgetIcon/defaulticon.jpg"

                if ( strtDate >= today ) {
                    list.push( x );
                }
                else if ( today <= endDate ) {
                    list.push( x );
                }
                else if ( same ) {
                    list.push( x );
                }

            } )
            this.historyList = list;
        }
    }

    setAppIcon( app, data ) {
        if ( data == 'img' ) {
            if ( this.utilityService.isNotNullOrEmptyOrUndefined( app.gifName ) ) {
                app.showImg = true
                app.showGif = false
            }
        } else if ( data == 'gif' ) {
            if ( this.utilityService.isNotNullOrEmptyOrUndefined( app.gifName ) ) {
                app.showGif = true
                app.showImg = false
            }
        }
    }
}
