import { Component } from '@angular/core';
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private topicService: TopicService) {
  }

  fetchAllTopics(): Array<Topic>{
    return this.topicService.findAll();
  }

  deleteTopic(topic: Topic): void{
    if (topic != undefined)
      return this.topicService.delete(topic);
  }

  openTopic(topic: Topic){
    if (topic != undefined){
      //redirect to detail page
    }
  }

  createTopic(){
    //redirect to form
  }
}
