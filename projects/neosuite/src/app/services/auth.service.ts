import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthorizationService,
  SessionService,
  IdleTimeOutService,
} from '@nw-workspace/common-services';
import { AuthConfig, OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  langTokens: any = {};

  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();
  refreshTokenFlag: boolean;

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private sessionService: SessionService,
    private authzService: AuthorizationService,
    private idleTimeOutService: IdleTimeOutService
  ) {
    this.oauthService.events
      .pipe(filter((e) => e.type == 'token_expires'))
      .subscribe((e) => {
        this.sessionService.refreshTokenFlag = true;
      });

    // Useful for debugging:
    this.oauthService.events.subscribe((event) => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        // console.warn('OAuthEvent Object:', event);
      }
    });

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    this.oauthService.events.subscribe((_) => {
      this.isAuthenticatedSubject$.next(
        this.oauthService.hasValidAccessToken()
      );
    });

    // this.oauthService.events
    //   .pipe(
    //     filter((e) =>
    //       [
    //         'session_terminated',
    //         'session_error',
    //         'code_error',
    //         'session_changed',
    //         'token_refresh_error',
    //       ].includes(e.type)
    //     )
    //   )
    //   .subscribe((e) => {
    //     console.log("Logging out now",new Date())
    //     this.navigateToLoginPage()});
  }

  async runInitialLoginSequence(): Promise<void> {
    let oauthconfig: AuthConfig = {
      requireHttps: false,
      skipIssuerCheck: true,
      strictDiscoveryDocumentValidation: false,
      issuer: environment.issuerHost + '/realms/',
      redirectUri: window.location.origin,
      clientId: 'neosuite-client',
      responseType: 'code',
      scope: 'openid profile email',
      sessionChecksEnabled: true,
      useSilentRefresh: true,
      showDebugInformation: true,
      postLogoutRedirectUri: window.location.origin + '/logout',
    };
    const urlParams = new URLSearchParams(window.location.search);
    const legacyToken = urlParams.get('token')?.trim();
    const removeKcIdpParam = urlParams.get('remove_kc_idp_hint')?.trim();
    const kcIdpParam = urlParams.get('kc_idp_hint')?.trim();

    if (legacyToken) {
      oauthconfig.customQueryParams = { 'jwt-legacy': legacyToken };
    }

    if (removeKcIdpParam != null) {
      localStorage.removeItem('kc_idp_hint');
    }

    if (kcIdpParam != null) {
      localStorage.setItem('kc_idp_hint', kcIdpParam);
    }

    const kcIdp = localStorage.getItem('kc_idp_hint');

    if (kcIdp != null) {
      oauthconfig.customQueryParams = {
        ...oauthconfig.customQueryParams,
        kc_idp_hint: kcIdp,
      };
    }
    let clientCode: string;
    try {
      clientCode = await this.getTenant();
      oauthconfig.issuer += clientCode;
      this.oauthService.configure(oauthconfig);
      localStorage.setItem('tenantID', clientCode);
      return this.oauthService
        .loadDiscoveryDocument()
        .then(() => this.oauthService.tryLogin())
        .then(async () => {
          if (this.oauthService.hasValidAccessToken()) {
            await this.authzService.init({
              config: {
                issuer: oauthconfig.issuer,
                clientId: oauthconfig.clientId,
              },
              initOptions: {
                loadPermissionsInStartup: false,
                defaultResourceServerId: 'neosuite-backend',
              },
            });

            return Promise.resolve();
          }
          return Promise.reject();
        })

        .then(() => {
          this.isDoneLoadingSubject$.next(true);
          if (
            this.oauthService.state &&
            this.oauthService.state !== 'undefined' &&
            this.oauthService.state !== 'null'
          ) {
            let stateUrl = this.oauthService.state;
            if (stateUrl.startsWith('/') === false) {
              stateUrl = decodeURIComponent(stateUrl);
            }
            console.log(
              `There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`
            );
            this.router.navigateByUrl(stateUrl);
          }
        })
        .catch(() => this.isDoneLoadingSubject$.next(true));
    } catch (error) {
      if (error.status == 404) this.router.navigate(['not-found']);
      else throw error;
    }
  }

  public login(targetUrl?: string) {
    // call encodeURIComponent on the argument to the method.
    this.oauthService.initLoginFlow(targetUrl || this.router.url);
  }

  async getTenant() {
    let tenantID = localStorage.getItem('tenantID');
    if (tenantID && tenantID.trim()) return tenantID;
    else {
      tenantID = await this.http
        .get<any>(
          'neosuite/publicApi/getClientByDomain?host=' +
            (environment.NeosuiteHost ?? window.location.hostname)
        )
        .pipe(map((x) => x.payload.clientCode))
        .toPromise();
    }
    return tenantID;
  }

  logout() {
    this.removeLocalSession().subscribe(
      (data) => {
        this.oauthService.logOut({
          client_id: this.oauthService.clientId,
        });
      },
      (error) => {
        this.oauthService.logOut({
          client_id: this.oauthService.clientId,
        });
      }
    );
  }
  getLanguageTokens(app) {
    //        var userDT: any = {};
    let currentUser = this.sessionService.getCurrentUser();
    let langCode = currentUser.additionalDetails.mdm.preferredLang;
    let clientCode = currentUser.additionalDetails.mdm.clientCode;
    //        localStorage.removeItem( 'currentUserLangToken' );
    return this.http
      .get<any>(
        'polyglot/api/tenants/' +
          clientCode +
          '/language-translation/lang/' +
          langCode +
          '/app/' +
          app
      )
      .subscribe((response) => {
        this.langTokens = {};
        if (
          response != null &&
          response.payload != undefined &&
          response.payload != null
        ) {
          response.payload.forEach((e, i) => {
            this.langTokens[e.appLabel] = e.translatedLabel;
          });
        }
        this.translate.setTranslation('en', this.langTokens, true);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        localStorage.setItem(
          'currentUserLangToken',
          JSON.stringify(this.langTokens)
        );
      });
  }

  setTheme() {
    return this.http
      .get<any>('neosuite/api/getMyCurrentTheme')
      .subscribe((data) => {
        // $( "<style/>" ).text( data ).appendTo( document.head )[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = data.payload;

        $('head').append(link);
      });
  }

  localLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  }

  removeLocalSession() {
    return this.http.get<any>('neosuite/api/removeLocalSession');
  }
}
