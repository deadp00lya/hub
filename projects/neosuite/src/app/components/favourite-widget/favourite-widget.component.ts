import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewContainerRef } from '@angular/core';
import * as M from "materialize-css/dist/js/materialize";
declare var $: any;
import { HttpClient } from "@angular/common/http";
import { WidgetDTO } from "../../models/WidgetDTO";
import { WidgetService } from "@nw-workspace/common-services";
import { ToastService } from "@nw-workspace/common-services";
import { CurrentBrowserService } from "../../services/current-browser.service";
import { Router } from '@angular/router';
import { AddDirective } from '../../directives/add.directive';
import { AuthService } from "../../services/auth.service";
import { environment } from '../../../environments/environment';
import { SessionService, UtilityService } from '@nw-workspace/common-services';
import { debug } from 'console';

@Component( {
    selector: 'app-favourite-widget',
    templateUrl: './favourite-widget.component.html',
    styleUrls: ['./favourite-widget.component.css']
} )
export class FavouriteWidgetComponent implements OnInit {
    height: number;
trayDown: boolean = true;
    allMyWidgets: WidgetDTO[] = [];
    items: WidgetDTO[] = [];
    favouriteWidgets = [];
    componentLoadWidget: WidgetDTO;
    userProfile: FormData;
    widgetInfo: any;
    instanceelModal1: any;
    
    /**************************
     * for widget snapshot
     **************************/
    @ViewChild( 'canvas', { static: true } ) canvas: ElementRef;
    @ViewChild( 'downloadLink', { static: true } ) downloadLink: ElementRef;
    /*************************************
     * Directive to load data into widget
     *************************************/
    @ViewChild( AddDirective, { static: true } ) adHost: AddDirective;
    /*******************************
     * Help Modal of Knowledge base
     *******************************/
    @ViewChild('helpmodal', { static: true }) elModalHelp: ElementRef;
    /****************************************
     * Component to load Knowledge base data
     ****************************************/
    @ViewChild('homeComponent', { read: ViewContainerRef, static: true })
    homeComponent: ViewContainerRef;
    
    constructor(
        public sessionService: SessionService, private router: Router,
        private http: HttpClient, private widgetService: WidgetService,
        private toastService: ToastService, private utilityService: UtilityService,
        public currentBrowser: CurrentBrowserService,
        private authService: AuthService) { }

    ngOnInit(): void {

        this.widgetService.currentWidgets.subscribe( widgets => {

            this.allMyWidgets = widgets;
            var showMenuflag = true;
            if ( this.allMyWidgets != null && this.allMyWidgets.length != 0 ) {
                this.allMyWidgets.forEach( item => {
                    item.showImg = true
                    item.showGif = false
                    item.visible = false
                   // if ( this.isUndefinedOrNullOrEmpty( item.widgetIcon ) )
                    if ( this.utilityService.isNullOrEmptyOrUndefined( item.widgetIcon ) ) 
                        item.widgetIcon = "assets/WidgetIcon/defaulticon.jpg"
             
                } )
//                this.componentLoadWidget = this.allMyWidgets[0];
                
                this.filterFavouriteWidgets()
                this.openWidget();

            }
        } )
    }
    ngAfterViewInit() {
        M.AutoInit();
        this.instanceelModal1 = new M.Modal( this.elModalHelp.nativeElement, { dismissible: false } );
        $( '.tap-target' ).tapTarget();
        $('.tabs').tabs();
    }


    filterFavouriteWidgets() {
        
        this.favouriteWidgets = []
            this.allMyWidgets.forEach( item => {
                if ( item.favourite) {
                    if ( !this.favouriteWidgets.includes( item ) )
                        this.favouriteWidgets.push( item );
                }
            } )

        if ( this.favouriteWidgets == null || this.favouriteWidgets.length == 0 ) {
            this.toastService.error( "No favourite widget found" );
            this.router.navigate( ["/home"] );
        }
        this.componentLoadWidget = this.favouriteWidgets[0];
    }

    hideShowWidget( widget ) {
        this.favouriteWidgets.forEach( item => {
            if ( item.widgetCode == widget.widgetCode ) {
                this.componentLoadWidget = item;
                this.componentLoadWidget.visible = true
                item.visible = true;
            }
            else
                item.visible = false
        } )
        this.openWidget();

    }

    openWidget() {
       
        this.componentLoadWidget.visible = true;
//        this.selectedWidget = this.componentLoadWidget.widgetCode
        this.authService.getLanguageTokens(this.componentLoadWidget.application.appCode)
        this.loadWidgetComponent( this.componentLoadWidget.widgetPath );
        this.saveUserWidgetLog();
    }
    
    // load widget from cw_Subject
    loadWidgetComponent( componentId ) {

        const viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();

        // this.dynamicComponentLoader.getComponentFactory( componentId )
        //     .subscribe( componentFactory => {

        //         let ref = viewContainerRef.createComponent( componentFactory );
        //         ref.instance.widgetDetail = this.componentLoadWidget;
        //     }, error => {
        //         console.warn( error );
        //     } );
    }
    
    //load knowledgeBase component
    // loadComponent(componentId) {
        
    //   this.homeComponent.clear();

    //   this.dynamicComponentLoader.getComponentFactory(componentId).subscribe(
    //     (componentFactory) => {
    //       let ref =  this.homeComponent.createComponent(componentFactory);
    //       ref.instance.currentWidgetInfo = this.componentLoadWidget;
    //     },
    //     (error) => {
    //       console.warn(error);
    //     }
    //   );
    // }

/*    isUndefinedOrNullOrEmpty( obj ) {
        if ( obj == undefined || obj == null || obj == "" ) {
            return true;
        }
        else {
            return false;
        }
    }*/

    takeScreenshot( item ) {
        
        // html2canvas(document.querySelector<any>("#capture_"+item.id)).then(canvas => {
        //    this.canvas.nativeElement.src = canvas.toDataURL();
        //     this.downloadLink.nativeElement.href = canvas.toDataURL( 'image/png' );
        //     this.downloadLink.nativeElement.download = item.widgetName + '.png';
        //     this.downloadLink.nativeElement.click();

        // });
    }

    setWidgetIcon( widget, data ) {
        if ( data == 'img' ) {
            if ( this.utilityService.isNotNullOrEmptyOrUndefined( widget.widgetGif ) ) {
                widget.showImg = true
                widget.showGif = false
            }
        } else if ( data == 'gif' ) {
            if ( this.utilityService.isNotNullOrEmptyOrUndefined( widget.widgetGif ) ) {
                widget.showGif = true
                widget.showImg = false
            }
        }
    }
    UnfavouriteWidget( w ) {
        
        this.userProfile = new FormData();
        this.userProfile.append( 'properties', new Blob( [JSON.stringify( {
            'profileId': w.profileId,
            'color': w.color,
            'userId': w.userId,
            'visible': w.visible,
            'widgetCode': w.widgetCode,
            'widgetHeight': w.widgetHeight,
            'widgetImagePath': w.widgetImagePath,
            'widgetName': w.widgetName,
            'widgetPositionX': w.widgetPositionX,
            'widgetPositionY': w.widgetPositionY,
            'widgetRadius': w.widgetRadius,
            'widgetWidth': w.widgetWidth,
            'getWidgetBgImgFlag': false,
            'favourite': false
        } )], {
                type: "application/json"
            } ) );

        return this.http.post<any>( "neosuite/api/favouriteWidget", this.userProfile
        ).subscribe( data => {

          /*  if ( data != null ) {
                this.items[index] = ( data.payload );
            }*/
        this.allMyWidgets.forEach(item=>{
            if(item.widgetCode==w.widgetCode)
                item.favourite=false;
        });
        
        this.widgetService.changeWidgets( this.allMyWidgets );
        } )
    }
    
    openModel( item ) {
//        this.widgetInfo = item;
//        this.instanceelModal1.open();
//        this.setPage( 'faqPage' );
//        $( '#helpModel' ).find( '.indicator' ).attr( 'style', 'right: 672px; left: 0px;' );
        let helpIconApp, helpIconWidget;
        this.widgetService.currentWidgets.subscribe( widgets => {
            widgets.forEach( widget => {
                if ( widget.widgetPath == environment.helpIconWidget) {
                    helpIconApp = widget.application.appName;
                    helpIconWidget = widget.widgetCode;
                }
            } );
        } );

        if (  this.utilityService.isNullOrEmptyOrUndefined( helpIconApp ) ) {
            this.toastService.error( "This widget is not assigned to you" )
            return;
        }

        else {
            this.router.navigate( ["/home/" + helpIconApp + '/' + helpIconWidget] );
        }        
    }
    
    closeModel() {
        this.instanceelModal1.close();
        $( '.tabs' ).tabs( 'select', 'faqPage' );
    }
    slideUpTray(){
        this.trayDown = true;
        this.height = 14;
    }
    
    slideDownTray(){
        this.trayDown = false;
        this.height = 3;
    }
    
    
    setPage( parameter ) {
        // if ( parameter == 'faqPage' ) {
        //     this.loadComponent( 'FaqHomeComponent' );
        // } else if ( parameter == 'faqTrendingPage' ) {
        //     this.loadComponent( 'TrendingComponent' );
        // }
        // else if ( parameter == 'knowledgebasePage' ) {
        //     this.loadComponent( 'KnowledgebaseHomeComponent' );
        // }
        // else if ( parameter == 'ContactUs' ) {
        //     this.loadComponent( 'ContactUsComponent' );
        // }
    }
    
    /* ***********************************
     * Custom widget content load method
     * ***********************************/
     buildContent( content, $event ) {
         var iWindow = ( <HTMLIFrameElement>$event.target ).contentWindow;
         iWindow.document.write( content );
     }
     
     /* **************************************
      * Method to save advancedUI widget log
      * **************************************/
     saveUserWidgetLog(){
         
         this.widgetService.saveUserWidgetLog( this.componentLoadWidget ).subscribe( response => {  } );
     }
}
