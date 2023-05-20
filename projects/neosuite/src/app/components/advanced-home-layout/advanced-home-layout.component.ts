import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Subscription, interval } from 'rxjs';
import * as M from 'materialize-css/dist/js/materialize';
import {
  SessionService,
  UtilityService,
  IdleTimeOutService,
  ToastService,
  WidgetService,
} from '@nw-workspace/common-services';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { datadogRum } from '@datadog/browser-rum';
declare var $: any;

@Component({
  selector: 'app-advanced-home-layout',
  templateUrl: './advanced-home-layout.component.html',
  styleUrls: ['./advanced-home-layout.component.css'],
})
export class AdvancedHomeLayoutComponent implements OnInit, OnDestroy {
  allMyWidgets: any;
  currentUser;

  @ViewChild('reloadpopup', {}) reloadPopup: ElementRef;

  instanceRevisionModal: any;
  constructor(
    private http: HttpClient,
    private widgetService: WidgetService,
    private toast: ToastService,
    private utilityService: UtilityService,
    private sessionService: SessionService,
    private authService: AuthService,
    private oauthService: OAuthService,
    private idleTimeOutService: IdleTimeOutService
  ) {}

  ngOnInit(): void {
    this.oauthService.events
      .pipe(
        filter((e) =>
          [
            'session_terminated',
            'session_error',
            'code_error',
            'session_changed',
            'token_refresh_error',
          ].includes(e.type)
        )
      )
      .subscribe((e) => {
        this.setupPopup();
      });

    this.getMyAllWidgets();
    this.currentUser = this.sessionService.getCurrentUser();

    var appList: string[] = [];
    appList.push('App10017');

    this.authService.getLanguageTokens(appList);
    // set user in Datadog
    datadogRum.setUser({
      id: this.currentUser.preferred_username,
      tenant: this.currentUser.additionalDetails.mdm.clientCode,
    });
    datadogRum.startSessionReplayRecording();
  }

  getMyAllWidgets() {
    return this.widgetService.getMyAllWidgets().subscribe((data) => {
      this.allMyWidgets = data;
      for (let widget of this.allMyWidgets) {
        if (widget.visible) {
          if (
            this.widgetService.appListString.length != 0 &&
            this.widgetService.appListString.every(
              (e) => e != widget.application.appName
            )
          ) {
            this.widgetService.appListString.push(widget.application.appCode);
          } else {
            this.widgetService.appListString.push(widget.application.appCode);
          }
        }
      }
    });
  }

  setupPopup() {
    let mythis = this;
    $(document).ready(function () {
      $('#sessionExpireModal').modal({ dismissible: false,'opacity':.7 });
      let instanceReloadPopup = M.Modal.getInstance(
        mythis.reloadPopup.nativeElement
      );

      instanceReloadPopup.open();
    });
  }

  reload() {
    this.oauthService.logOut(true);
    location.reload();
  }

  ngOnDestroy(): void {}

}
