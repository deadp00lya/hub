import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  SessionService,
  ToastService,
  UtilityService,
  WidgetService,
} from '@nw-workspace/common-services';
import * as M from 'materialize-css/dist/js/materialize';
import { CompleterService } from 'ng2-completer';
import { ApplicationDTO } from '../../models/ApplicationDTO';
import { SearchWidgetDTO } from '../../models/SearchWidgetDTO';
import { WidgetDTO } from '../../models/WidgetDTO';
import { AuthService } from '../../services/auth.service';
import { CurrentBrowserService } from '../../services/current-browser.service';

declare var $: any;
declare var require: any;
declare var Twilio: any;

interface Card {
  [key: string]: string | boolean | number;
}

@Component({
  selector: 'app-advanced-home',
  templateUrl: './advanced-home.component.html',
  styleUrls: ['./advanced-home.component.css'],
})
export class AdvancedHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  showFakeSarch: boolean = true;
  flag: number;
  instanceSearchModal: any;

  allMyWidgets: WidgetDTO[] = [];
  recentAppList: ApplicationDTO[] = [];
  items: WidgetDTO[] = [];
  applications: ApplicationDTO[] = [];
  tempAppModules: any[];
  filterAppWidgets = [];
  appShow: boolean = false;
  tempAppModuleList = [];
  currentUser;
  //tagList: any[] = [];
  searchWidgetList: SearchWidgetDTO[] = [];
  searchWidgetDTO: SearchWidgetDTO;
  closeIcon: boolean = false;
  ShowAllApps: boolean = true;
  searchWidget: string;
  backgroundImage: string =
    'assets/WidgetIcon/advanced_default_user_background_image.png';

  constructor(
    public sessionService: SessionService,
    private router: Router,
    private http: HttpClient,
    private widgetService: WidgetService,
    private toast: ToastService,
    private completerService: CompleterService,
    public translate: TranslateService,
    private authService: AuthService,
    private currentBrowser: CurrentBrowserService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {

    this.currentUser = this.sessionService.getCurrentUser();
    this.widgetService.currentWidgets.subscribe((widgets) => {
      this.allMyWidgets = widgets;
      var showMenuflag = true;
      if (this.allMyWidgets != null && this.allMyWidgets.length != 0) {
        this.allMyWidgets.forEach((item) => {
          item.showImg = true;
          item.showGif = false;
          if (this.isUndefinedOrNullOrEmpty(item.widgetIcon))
            item.widgetIcon = 'assets/WidgetIcon/defaulticon.jpg';

          if (
            !this.applications.find(function (app) {
              return app.appName == item.application.appName;
            })
          ) {
            this.applications.push(item.application);
            item.application.url =
              item.application.appName + '/' + item.routePath;
          }

          if (item.visible == true) showMenuflag = false;
        });
      } else {
        showMenuflag = false;
      }

      if (this.applications != null || this.applications.length > 0) {
        this.applications.forEach((app) => {
          app.showImg = true;
          app.showGif = false;
          if (this.isUndefinedOrNullOrEmpty(app.iconName))
            app.iconName = 'assets/WidgetIcon/defaulticon.jpg';
        });
      }

      if (showMenuflag) {
        this.appShow = true;
        //this.showAppGrid();  // call it in development
      } else {
        if (this.tempAppModules == null || this.tempAppModules == undefined) {
          this.appShow = true;
        }
        //this.hideGridMenu();
      }

      //            let recentApps = JSON.parse( localStorage.getItem( "recentApps" ) );
      //            if ( this.isUndefinedOrNullOrEmpty( recentApps ) ) {
      //                this.ShowAllApps= true;
      //                this.getRecentApplication();
      //            }
    });
    this.getBackgroundImage();
  }
  @ViewChild('elSearchModal', { static: true }) elSearchModal: ElementRef;
  ngAfterViewInit() {
    this.instanceSearchModal = new M.Modal(this.elSearchModal.nativeElement, {
      dismissible: true,
      onCloseStart: () => {
        this.showFakeSarch = true;
      },
    });
  }

  searchOpen() {
    this.instanceSearchModal.open();
    this.showFakeSarch = false;
    $(document).find('input[type=text]').trigger('focus');
  }

  ngOnDestroy(): void {
  }

  isUndefinedOrNullOrEmpty(obj) {
    if (obj == undefined || obj == null || obj == '') {
      return true;
    } else {
      return false;
    }
  }

  filterAppModules(application) {
    var filterdModules = [];
    this.allMyWidgets.forEach((item) => {
      if (item.application.appName == application.appName) {
        if (
          !filterdModules.find(function (module) {
            return module.moduleName == item.appModule.moduleName;
          })
        ) {
          filterdModules.push(item.appModule);
        }
      }
    });
    this.tempAppModuleList = filterdModules;

    return filterdModules;
  }

  filterAppWidget() {
    this.filterAppWidgets = [];
    this.tempAppModuleList.forEach((module) => {
      this.allMyWidgets.forEach((item) => {
        if (item.appModule.id == module.id) {
          if (!this.filterAppWidgets.includes(item))
            this.filterAppWidgets.push(item);
        }
      });
    });

    this.filterAppWidgets;
  }

  showSuggestion() {
    //this.tagList = [];
    //this.tagList = [];
    this.searchWidgetList = [];
    if (this.allMyWidgets != null && this.allMyWidgets.length != 0) {
      this.allMyWidgets.forEach((item) => {
        //this.tagList.push( x.widgetName );
        this.searchWidgetDTO = new SearchWidgetDTO();
        this.searchWidgetDTO.name = item.widgetName;
        this.searchWidgetDTO.appName = item.application.appName;
        this.searchWidgetDTO.type = 'Widget';
        this.searchWidgetDTO.widgetCode = item.widgetCode;
        this.searchWidgetList.push(this.searchWidgetDTO);

        if (
          !this.searchWidgetList.some(
            (app) => app.name === item.application.appName
          )
        ) {
          this.searchWidgetDTO = new SearchWidgetDTO();
          this.searchWidgetDTO.name = item.application.appName;
          this.searchWidgetDTO.type = 'Application';

          this.searchWidgetList.push(this.searchWidgetDTO);
        }
      });

      //this.suggetions = this.completerService.local( this.tagList );
      //   this.suggetions = this.completerService.local( this.tagList).descriptionField("Hello").imageField("/assets/WidgetIcon/Neeyamo works logo.png");
    }
  }
  onFocus() {
    //this.tagList = [];
    this.searchWidgetList = [];
    if (this.allMyWidgets != null && this.allMyWidgets.length != 0) {
      this.allMyWidgets.forEach((item) => {
        //this.tagList.push( x.widgetName );
        if (this.searchWidgetList.length <= 3) {
          this.searchWidgetDTO = new SearchWidgetDTO();
          this.searchWidgetDTO.name = item.widgetName;
          this.searchWidgetDTO.appName = item.application.appName;
          this.searchWidgetDTO.type = 'Widget';
          this.searchWidgetDTO.widgetCode = item.widgetCode;
          this.searchWidgetList.push(this.searchWidgetDTO);

          if (
            !this.searchWidgetList.some(
              (app) => app.name === item.application.appName
            )
          ) {
            this.searchWidgetDTO = new SearchWidgetDTO();
            this.searchWidgetDTO.name = item.application.appName;
            this.searchWidgetDTO.type = 'Application';

            this.searchWidgetList.push(this.searchWidgetDTO);
          }
        }
      });

      //this.suggetions = this.completerService.local( this.tagList );
      //   this.suggetions = this.completerService.local( this.tagList).descriptionField("Hello").imageField("/assets/WidgetIcon/Neeyamo works logo.png");
    }
  }

  setAppIcon(app, data) {
    if (data == 'img') {
      if (this.utilityService.isNotNullOrEmptyOrUndefined(app.gifName)) {
        app.showImg = true;
        app.showGif = false;
      }
    } else if (data == 'gif') {
      if (this.utilityService.isNotNullOrEmptyOrUndefined(app.gifName)) {
        app.showGif = true;
        app.showImg = false;
      }
    }
  }

  openWidget(searchWidget) {
    if (searchWidget.type == 'Application') {
      this.router.navigate(['home/' + searchWidget.name]);
      this.recentApp(searchWidget.name);
    } else {
      this.router.navigate([
        'home/' + searchWidget.appName + '/' + searchWidget.widgetCode,
      ]);
    }
  }

  recentApp(app) {
    let recentApp = [];
    recentApp = JSON.parse(localStorage.getItem('recentApps'));

    if (this.isUndefinedOrNullOrEmpty(recentApp)) {
      recentApp = [];
      recentApp.push(app);
    } else if (recentApp.length < 6) {
      if (!recentApp.includes(app)) recentApp.push(app);
    } else if (recentApp.length == 6) {
      if (!recentApp.includes(app)) {
        recentApp.splice(0, 1);
        recentApp.push(app);
      }
    }
    localStorage.setItem('recentApps', JSON.stringify(recentApp));
  }
  getRecentApplication() {
    let recentApp = [];
    this.recentAppList = [];
    recentApp = JSON.parse(localStorage.getItem('recentApps'));
    if (
      !this.isUndefinedOrNullOrEmpty(recentApp) &&
      !this.isUndefinedOrNullOrEmpty(this.allMyWidgets)
    ) {
      this.allMyWidgets.filter((wid) => {
        if (recentApp.includes(wid.application.appName)) {
          if (
            !this.recentAppList.some(
              (app) => app.appName === wid.application.appName
            )
          ) {
            this.recentAppList.push(wid.application);
          }
        }
      });
      this.recentAppList.forEach((app) => {
        app.showImg = true;
        app.showGif = false;
        if (this.isUndefinedOrNullOrEmpty(app.iconName))
          app.iconName = 'assets/WidgetIcon/defaulticon.jpg';
      });
    }
  }

  getBackgroundImage() {
    return this.http
      .get<any>('neosuite/api/getBackgroundImage')
      .subscribe((data) => {
        var bgImage = data.payload;

        if (this.utilityService.isNotNullOrEmptyOrUndefined(bgImage))
          this.backgroundImage = bgImage;
        else
          this.backgroundImage =
            'assets/WidgetIcon/advanced_default_user_background_image.png';
      });
  }
}
