import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register/register.component';

import { MainUiComponent } from './main-ui/main-ui.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { ChatComponent } from './chat/chat.component';
import { MatchComponent } from './match/match.component';
import { SettingsEditingComponent } from './settings-editing/settings-editing.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
     MainUiComponent,
     ProfileBoxComponent,
     ChatComponent,
     MatchComponent,
     SettingsEditingComponent,
     LoginComponent,
     ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
