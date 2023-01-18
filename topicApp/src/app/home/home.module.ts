import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { Topic } from '../models/topic';
import { Observable } from 'rxjs';
import { TopicService } from '../services/topic.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {

  constructor(private topicServce: TopicService ){

  }

  ngOnInit(){
    this.getTopics();
  }

  getTopics() : Array<Topic>
  {
    return this.topicServce.findAll();
  }
}
