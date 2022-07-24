import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";

import { RegisterComponent } from './register/register.component';

import { MainUiComponent } from './main-ui/main-ui.component';
import { ChatComponent } from './chat/chat.component';
import { MatchComponent } from './match/match.component';
import { SettingsEditingComponent } from './settings-editing/settings-editing.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChatverlaeufeComponent } from './chatverlaeufe/chatverlaeufe.component';
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { AuthGuard } from './auth.guard.guard';
import { DatePipe } from '@angular/common';
import {MatSliderModule,} from '@angular/material/slider'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ProfileViewComponent } from './profile-view/profile-view.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
     MainUiComponent,
     ChatComponent,
     MatchComponent,
     SettingsEditingComponent,
     LoginComponent,
     ProfileComponent,
     ChatverlaeufeComponent,
     ProfileViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSliderModule,
    MatCheckboxModule,
    RouterModule.forRoot([     //Abkürzungen für die Links zu den Components | Später wichtig für die Login Überwachung
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },{
        path: 'mainUI',
        component: MainUiComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'chatverlaeufe',
        component: ChatverlaeufeComponent
      },
      {
        path: 'match',
        component: MatchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: SettingsEditingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '', //Hauptseite
        component: MainUiComponent
      }
    ])

  ],
  providers: [
    {   //Verhindert, dass Unterseiten beim Neuladen nicht gefunden werden
    provide: LocationStrategy,
    useClass: HashLocationStrategy
    },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
