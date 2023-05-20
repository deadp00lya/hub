import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { config, Observable, of } from 'rxjs';
import { CurrentBrowserService } from './services/current-browser.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { datadogRum } from '@datadog/browser-rum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  //this is main app
  title = 'app';
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(
    private oauthService: OAuthService,
    private currentBrowserService: CurrentBrowserService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentBrowserService.isEdge = /edge\//i.test(
      window.navigator.userAgent
    );
    this.currentBrowserService.isIe = /msie\s|trident\//i.test(
      window.navigator.userAgent
    );
    this.currentBrowserService.isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.currentBrowserService.isSafari =
      /safari\//i.test(navigator.userAgent) &&
      /Apple Computer, Inc/.test(navigator.vendor);
  }

  ngAfterViewInit() {
    var element = document.getElementById('divLoading');
    element.parentNode.removeChild(element);

    datadogRum.init({
      clientToken: 'pubeaa1a38e2d5a359f4631eb470fc16196',
      applicationId: '2d4d9bc0-95e9-4c68-aeef-cdd09c78a54b',
      site: 'datadoghq.eu',
      service: 'neosuite_uat',
      env: 'uat',
      // Specify a version number to identify the deployed version of your application in Datadog
      // version: '1.0.0',
      sampleRate: 100,
      sessionReplaySampleRate: 20,
      trackInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
      allowedTracingOrigins: [/https:\/\/neosuite.*\.neeyamo\.works/],
    });
  }
}
