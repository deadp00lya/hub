import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as M from "materialize-css/dist/js/materialize";
import { UserDTO } from "../../../models/userDTO";
import { ProxySettingDTO } from "../../../models/ProxySettingDTO";
import { WidgetService } from "@nw-workspace/common-services";
import { WidgetDTO } from "../../../models/WidgetDTO";
declare var $: any;

@Component( {
    selector: 'app-proxy',
    templateUrl: './proxy.component.html',
    styleUrls: ['./proxy.component.css']
} )
export class ProxyComponent implements OnInit {

    userList: UserDTO[] = [];
    proxySettingDTO: ProxySettingDTO = new ProxySettingDTO();
    //generalFlag: boolean = true;
    proxyUserName: string;
    allMyWidgets: WidgetDTO[] = [];
    startDate: string;
    endDate: string;
    proxyList: ProxySettingDTO[] = [];
    proxySetFlag: boolean = false;
    proxySettingList: ProxySettingDTO[] = [];
    widgetCode: string;
    userId: number;
    index: number;

    constructor( private http: HttpClient, private widgetService: WidgetService ) { }

    ngOnInit() {

        this.getMyAllWidgets();
       /* this.widgetService.currentWidgets.subscribe( widgets => {
            this.allMyWidgets = widgets
        } )*/
        // this.showProxyContent();
        this.fetchUsersProxiesBy();
    }

    fetchUserNamesForProxy() {
        
        return this.http.get<any>( 'neosuite/api/fetchUserNamesForProxy' )
            .subscribe( data => {
              
                this.userList = data.payload;
                setTimeout( function() {
                    $( 'select' ).formSelect();
                }, 10 );
            } )
    }

    /*showProxyContent() {
        //this.generalFlag = false;
        this.proxyUserName = null;
        this.fetchUserNamesForProxy();
        this.resetProxySetting();
        //this.allMyWidgets;
        setTimeout( function() {
            $( 'select' ).formSelect();
            var elems = document.querySelectorAll( '.datepicker' );
            var instances = M.Datepicker.init( elems );
        }, 100 );
    }*/

    resetProxySetting() {
        this.proxySettingDTO.proxiedTo = [];
        this.proxySettingDTO.widgetCode = [];
        this.startDate = null;
        this.endDate = null;
        this.proxySettingDTO = new ProxySettingDTO();
    }

    saveProxySetting() {

       
        var firstTime: boolean = true;
        if ( this.startDate != null || this.startDate != undefined ) {
            this.proxySettingDTO.startDate = new Date( this.startDate );
        }
        if ( this.endDate != null || this.endDate != undefined ) {
            this.proxySettingDTO.endDate = new Date( this.endDate );
        }

        if ( this.proxySettingList != null || this.proxySettingList.length > 0 ) {
            for ( let user of this.proxySettingDTO.proxiedTo ) {
                for ( let i = 0; i < this.proxySettingList.length; i++ ) {

                    let missing = this.proxySettingDTO.proxiedTo.filter( item => this.proxySettingList[i].proxiedTo.indexOf( item ) < 0 );
                    if ( missing.length == 0 ) {
                        firstTime = false;
                    }
                }
            }
        }

        if ( firstTime == false ) {
            this.updateProxySetting( this.proxySettingDTO );
        }

        if ( firstTime == true ) {
            this.http.post<any>( 'neosuite/api/saveProxySetting', this.proxySettingDTO )
                .subscribe( data => {
                   
                    this.proxyList = data.payload;
                    this.resetProxySetting();
                    setTimeout( function() {
                        $( 'select' ).formSelect();
                    }, 10 );
                } );
        }
    }

    updateProxySetting( proxySettingDTO ) {

       
        this.http.post<any>( 'neosuite/api/updateProxySetting', proxySettingDTO )
            .subscribe( data => {
               
                this.resetProxySetting();
                setTimeout( function() {
                    $( 'select' ).formSelect();
                }, 10 );
            } );
    }

    createProxySetting() {
       
        this.proxySetFlag = true;
        this.proxyUserName = null;
        this.fetchUserNamesForProxy();
        this.resetProxySetting();
        this.fetchUsersProxiesBy();
        //this.allMyWidgets;
        setTimeout( function() {
            $( 'select' ).formSelect();
            var elems = document.querySelectorAll( '.datepicker' );
            var instances = M.Datepicker.init( elems );
        }, 100 );
    }

    cancel() {
        
        this.proxySetFlag = false;
        this.fetchUsersProxiesBy();
    }

    fetchUsersProxiesBy() {
      
        this.http.get<any>( 'neosuite/api/fetchUsersProxiesBy' )
            .subscribe( data => {
               
                this.proxySettingList = data.payload;
                /* setTimeout( function() {
                     $( 'select' ).formSelect();
                 }, 10 );*/
            } )
    }

    deleteproxy( widgetCode, userId, i ) {
        
        $( '#deleteProxyModal' ).modal();
        this.widgetCode = widgetCode;
        this.userId = userId;
        this.index = i;
    }

    deleteStatus( status ) {
       
        if ( status == "Yes" ) {
            this.http.get<any>( 'neosuite/api/deleteProxySetting?widgetCode=' + this.widgetCode + "&userId=" + this.userId )
                .subscribe( data => {
                    this.proxySettingList.splice( this.index, 1 );
                    $( '#deleteProxyModal' ).modal( 'close' );
                } );
        }
        else {
            $( '#deleteProxyModal' ).modal( 'close' );
        }
    }

    getMyAllWidgets() {
        return this.http.get<any>( "neosuite/api/getMyAllWidgets" )
            .subscribe( data => {
                this.allMyWidgets = data.payload;
            } )
    }


}
