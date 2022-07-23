import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatverlaeufeComponent } from './chatverlaeufe/chatverlaeufe.component';
import { LoginComponent } from './login/login.component';
import { MainUiComponent } from './main-ui/main-ui.component';
import { MatchComponent } from './match/match.component';
import { ProfileBoxComponent } from './profile-box/profile-box.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SettingsEditingComponent } from './settings-editing/settings-editing.component';
const routes: Routes = [
  {path: 'chat-component', component: ChatComponent},
  {path: 'chatverlaeufe-component', component: ChatverlaeufeComponent},
  {path: 'login-component', component: LoginComponent},
  {path: 'main-ui-component', component: MainUiComponent},
  {path: 'match-component', component: MatchComponent},
  {path: 'profile-component', component: ProfileComponent},
  {path: 'profile-component', component: ProfileBoxComponent},
  {path: 'register-component', component: RegisterComponent},
  {path: 'settings-edit-component', component: SettingsEditingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
