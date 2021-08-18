import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.azureAdB2cPolicies.clientId, // This is your client ID
        authority: environment.azureAdB2cPolicies.authorities.signUpsignIn.authority, // This is your tenant ID
        knownAuthorities: [environment.azureAdB2cPolicies.authorityDomain],
        redirectUri: environment.azureAdB2cPolicies.redirectUri// This is your redirect URI
      },
      cache: {
        cacheLocation: environment.azureAdB2cPolicies.cacheLocation,
      },
      system: {
        loggerOptions: {
          loggerCallback: () => { },
          piiLoggingEnabled: false
        }
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
    }, {
      // MSAL Interceptor Configuration
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ['https://api.myapplication.com/users/*', ['customscope.read']],
        ['http://localhost:4200/about/', null]
      ])

    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  },
    MsalService,
    MsalGuard,
    MsalBroadcastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
