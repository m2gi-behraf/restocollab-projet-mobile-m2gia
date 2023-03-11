import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import {SettingsPageModule} from "../settings/settings.module";
import {HeaderModule} from "../../components/header/header.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    SettingsPageModule,
    HeaderModule
  ],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule {}
