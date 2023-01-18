import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicDetailsPageRoutingModule } from './topic-details-routing.module';

import { TopicDetailsPage } from './topic-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopicDetailsPageRoutingModule
  ],
  declarations: [TopicDetailsPage]
})
export class TopicDetailsPageModule {}
