import { map, catchError, take, filter, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { SessionService } from '@nw-workspace/common-services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter((isDone) => isDone),
      switchMap((_) => this.authService.isAuthenticated$),
      tap((isAuthenticated) => {
        if (isAuthenticated) {
        
          if (state.url.includes('/home?token=')) {
            this.router.navigate(['home']);
            return false;
          }
          return true;
        } else
          this.authService.login(
            this.removeExtraParam(state.url, '/home?token')
          );
      })
    );
  }
  removeExtraParam(url: string, param: string) {
    let params = new URLSearchParams(url);

    let paramValue = params.get(param);
    if (paramValue != '' && paramValue != null) {
      let paramTodelete = param + '=' + paramValue;
      url = url.replace(paramTodelete, '');
    }
    return url;
  }
}
