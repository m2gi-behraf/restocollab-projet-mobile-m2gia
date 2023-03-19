import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {HeaderModule} from "../../components/header/header.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    Ng2SearchPipeModule,
    HeaderModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
