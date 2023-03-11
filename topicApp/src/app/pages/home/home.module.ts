import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {SettingsPageModule} from "../settings/settings.module";
import {HeaderModule} from "../../components/header/header.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    Ng2SearchPipeModule,
    SettingsPageModule,
    HeaderModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
