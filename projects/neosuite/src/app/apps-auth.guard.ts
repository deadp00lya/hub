import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { WidgetService } from '@nw-workspace/common-services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppsAuthGuard implements CanActivate, CanActivateChild {
  constructor(private widgetService: WidgetService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.widgetService.getMyAllWidgets().pipe(
      map((widgets) => {
        const url = decodeURIComponent(decodeURIComponent(state.url));
        const app = url.split('/')[1]?.toUpperCase();
        const widgetPath = url.split('/')[2]?.split('?')[0]?.toUpperCase();
        const widgetExtension = url.split('/')[3]?.split('?')[0]?.toUpperCase();

        if (widgetExtension) {
          // Look for exact matching first with extension if exist
          const exactMatchWidgetExt = widgets.find(
            (widget) =>
              widget.application.appName.toUpperCase() === app &&
              widget.routePath?.toUpperCase() === `${widgetPath}/${widgetExtension}`
          );
          if (exactMatchWidgetExt) {
            this.widgetService.setSelectedWidget(exactMatchWidgetExt);
            return true;
          }
        }

        if (widgetPath) {
          // Look for exact matching first
          const exactMatchWidget = widgets.find(
            (widget) =>
              widget.application.appName.toUpperCase() === app &&
              widget.routePath?.toUpperCase() === widgetPath
          );
          if (exactMatchWidget) {
            this.widgetService.setSelectedWidget(exactMatchWidget);
            return true;
          }

          // If not found, look for partial matching
          const partialMatchWidget = widgets.find(
            (widget) =>
              widget.application.appName.toUpperCase() === app &&
              widget.routePath?.toUpperCase().includes(widgetPath)
          );
          if (partialMatchWidget) {
            this.widgetService.setSelectedWidget(partialMatchWidget);
            return true;
          }
        }

        // If still not found, redirect to home
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}
