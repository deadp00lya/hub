import { HttpClient } from '@angular/common/http';
import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  SessionService,
  ToastService,
  UtilityService,
  WidgetService
} from '@nw-workspace/common-services';
import * as M from 'materialize-css/dist/js/materialize';
import { combineLatest, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WidgetDTO } from '../../models/WidgetDTO';
import { AuthService } from '../../services/auth.service';
import { CurrentBrowserService } from '../../services/current-browser.service';

declare var $: any;

@Component({
  selector: 'app-advanced-app',
  templateUrl: './advanced-app.component.html',
  styleUrls: ['./advanced-app.component.css'],
})
export class AdvancedAppComponent implements OnInit, OnDestroy {
  allMyWidgets: WidgetDTO[] = [];
  filterAppWidgets = [];
  componentLoadWidget: WidgetDTO;
  userProfile: FormData = new FormData();
  instanceelModal1: any;
  eventsandwidgets$: Subscription;
  constructor(
    public sessionService: SessionService,
    private router: Router,
    private http: HttpClient,
    private widgetService: WidgetService,
    private utilityService: UtilityService,
    public currentBrowser: CurrentBrowserService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    let events$ = this.router.events;
    let currentWidgets$ = this.widgetService.currentWidgets;
    let selectedWidget$ = this.widgetService.selectedWidget$;
    this.eventsandwidgets$ = combineLatest([
      events$,
      currentWidgets$,
      selectedWidget$,
    ]).subscribe(([event, widgets, selectedWidget]) => {
      if (event instanceof NavigationEnd) {
        this.allMyWidgets = widgets;
        this.componentLoadWidget = selectedWidget;
        this.filterAppWidgets = this.filterWidgetsByApps(
          selectedWidget.application.appName
        );

        this.filterAppWidgets.forEach((item) => {
          {
            item.showImg = true;
            item.showGif = false;
            item.visible = false;
            if (this.isUndefinedOrNullOrEmpty(item.widgetIcon))
              item.widgetIcon = 'assets/WidgetIcon/defaulticon.jpg';
          }
        });
      }
    });
  }

  filterWidgetsByApps(appName: string) {
    return this.allMyWidgets.filter(
      (widget) =>
        appName != null &&
        appName.toUpperCase() == widget.application.appName.toUpperCase()
    );
  }

  ngOnDestroy(): void {
    this.eventsandwidgets$.unsubscribe();
  }

  ngOnInit(): void {
    // this.componentLoadWidget.visible = true;
    this.saveUserWidgetLog();
    this.authService.getLanguageTokens(
      this.componentLoadWidget.application.appCode
    );
  }

  ngAfterViewInit() {
    // this.cw_Subject.subscribe(() => {

    //     if ( this.componentLoadWidget ) {
    //         this.authService.getLanguageTokens( this.componentLoadWidget.application.appCode );
    //        // this.loadWidgetComponent( this.componentLoadWidget.widgetPath );
    //         this.componentLoadWidget.visible = true;
    //         this.saveUserWidgetLog();
    //     }
    // } );
    

    M.AutoInit();
    // this.instanceelModal1 = new M.Modal(this.elModalHelp.nativeElement, {
    //   dismissible: false,
    // });
    // $('.tap-target').tapTarget();
  }

  // load widget from cw_Subject
  loadWidgetComponent(componentId) {
    // const viewContainerRef = this.adHost.viewContainerRef;
    // viewContainerRef.clear();
    // this.dynamicComponentLoader.getComponentFactory(componentId).subscribe(
    //   (componentFactory) => {
    //     let ref = viewContainerRef.createComponent(componentFactory);
    //     ref.instance.widgetDetail = this.componentLoadWidget;
    //   },
    //   (error) => {
    //     console.warn(error);
    //   }
    // );
  }

  //load knowledgeBase component
  loadComponent(componentId) {
    // this.homeComponent.clear();
    // this.dynamicComponentLoader.getComponentFactory(componentId).subscribe(
    //   (componentFactory) => {
    //     let ref = this.homeComponent.createComponent(componentFactory);
    //     ref.instance.currentWidgetInfo = this.componentLoadWidget;
    //   },
    //   (error) => {
    //     console.warn(error);
    //   }
    // );
  }

  isUndefinedOrNullOrEmpty(obj) {
    if (obj == undefined || obj == null || obj == '') {
      return true;
    } else {
      return false;
    }
  }

  setWidgetIcon(widget, data) {
    if (data == 'img') {
      if (this.utilityService.isNotNullOrEmptyOrUndefined(widget.widgetGif)) {
        widget.showImg = true;
        widget.showGif = false;
      }
    } else if (data == 'gif') {
      if (this.utilityService.isNotNullOrEmptyOrUndefined(widget.widgetGif)) {
        widget.showGif = true;
        widget.showImg = false;
      }
    }
  }

  saveUserWidgetProfile(w) {
    this.userProfile.append(
      'properties',
      new Blob(
        [
          JSON.stringify({
            profileId: w.profileId,
            color: w.color,
            userId: w.userId,
            visible: w.visible,
            widgetCode: w.widgetCode,
            widgetHeight: w.widgetHeight,
            widgetImagePath: w.widgetImagePath,
            widgetName: w.widgetName,
            widgetPositionX: w.widgetPositionX,
            widgetPositionY: w.widgetPositionY,
            widgetRadius: w.widgetRadius,
            widgetWidth: w.widgetWidth,
            getWidgetBgImgFlag: false,
            favourite: true,
          }),
        ],
        {
          type: 'application/json',
        }
      )
    );

    return this.http
      .post<any>('neosuite/api/favouriteWidget', this.userProfile)
      .subscribe(() => {
        /*  if ( data != null ) {
                      this.items[index] = ( data.payload );
                  }*/
        //this.loading = false;
        this.allMyWidgets.forEach((item) => {
          if (item.widgetCode == w.widgetCode) item.favourite = true;
        });

        this.widgetService.changeWidgets(this.allMyWidgets);
      });
  }

  openModel(item) {
    //      this.widgetInfo = item;
    //      this.instanceelModal1.open();
    //      this.setPage( 'faqPage' );
    //      $( '#helpModel' ).find( '.indicator' ).attr( 'style', 'right: 672px; left: 0px;' );
    let helpIconApp, helpIconWidget;
    this.widgetService.currentWidgets.subscribe((widgets) => {
      widgets.forEach((widget) => {
        if (widget.widgetPath == environment.helpIconWidget) {
          helpIconApp = widget.application.appName;
          helpIconWidget = widget.widgetCode;
        }
      });
    });

    if (this.isUndefinedOrNullOrEmpty(helpIconApp)) {
      this.toastService.error('This widget is not assigned to you');
      return;
    } else {
      this.router.navigate(['/home/' + helpIconApp + '/' + helpIconWidget]);
    }
  }

  closeModel() {
    this.instanceelModal1.close();
    $('.tabs').tabs('select', 'faqPage');
  }

 

  setPage(parameter) {
    if (parameter == 'faqPage') {
      this.loadComponent('FaqHomeComponent');
    } else if (parameter == 'faqTrendingPage') {
      this.loadComponent('TrendingComponent');
    } else if (parameter == 'knowledgebasePage') {
      this.loadComponent('KnowledgebaseHomeComponent');
    } else if (parameter == 'ContactUs') {
      this.loadComponent('ContactUsComponent');
    }
  }

  /* ***********************************
   * Custom widget content load method
   * ***********************************/
  buildContent(content, $event) {
    var iWindow = (<HTMLIFrameElement>$event.target).contentWindow;
    iWindow.document.write(content);
  }

  /* **************************************
   * Method to save advancedUI widget log
   * **************************************/
  saveUserWidgetLog() {
    this.widgetService
      .saveUserWidgetLog(this.componentLoadWidget)
      .subscribe((response) => {});
  }
}
