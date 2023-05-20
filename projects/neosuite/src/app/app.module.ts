import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgProgressModule } from '@ngx-progressbar/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthzModule, ErrorInterceptorService } from '@nw-workspace/common-services';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { Ng2CompleterModule } from 'ng2-completer';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessDeniedComponent } from "./components/access-denied/access-denied.component";
import { AdvancedAppComponent } from './components/advanced-app/advanced-app.component';
import { AdvancedHeaderComponent } from './components/advanced-header/advanced-header.component';
import { AdvancedHomeLayoutComponent } from './components/advanced-home-layout/advanced-home-layout.component';
import { AdvancedHomeComponent } from './components/advanced-home/advanced-home.component';
import { FavouriteWidgetComponent } from './components/favourite-widget/favourite-widget.component';
import { FooterComponent } from './components/footer/footer.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AddDirective } from './directives/add.directive';
import { SearchWidgetPipe } from './directives/search-widget.pipe';
import { authAppInitializerFactory } from './services/auth-app-initializer.factory';
import { AuthService } from './services/auth.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AnnoucementsComponent } from './components/annoucements/annoucements.component';
export function storageFactory(): OAuthStorage {
    return localStorage
}

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        LogoutComponent,
        AccessDeniedComponent,
        AdvancedHomeLayoutComponent,
        AdvancedHeaderComponent,
        AdvancedHomeComponent,
        AddDirective,
        FavouriteWidgetComponent,
        SearchWidgetPipe,
        NotFoundComponent,
        AnnoucementsComponent,
        AdvancedAppComponent
        
        
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule, ReactiveFormsModule,
        NgProgressModule.withConfig({
            meteor: false,
            color: '#1B95E0',
            thick: true,
            spinner: false
        }),
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        FormsModule,
        ReactiveFormsModule,
        Ng2CompleterModule,
        TranslateModule,
        NgSelectModule,
        OAuthModule.forRoot(),
        AuthzModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
        { provide: OAuthStorage, useFactory: storageFactory },
        { provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [AuthService], multi: true },
        { provide: 'ApiGatewayURL', useValue: environment.ApiGatewayURL },
        { provide: 'NeosuiteApiGatewayURL', useValue: environment.NeosuiteApiGatewayURL }
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }


