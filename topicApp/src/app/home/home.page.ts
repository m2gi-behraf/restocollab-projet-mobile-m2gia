import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePostComponent } from '../modals/create-post/create-post.component';
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private topicService: TopicService, private modalCtrl: ModalController) {
  }

  fetchAllTopics(): Array<Topic> {
    return this.topicService.findAll();
  }

  deleteTopic(topic: Topic): void {
    if (topic != undefined)
      return this.topicService.delete(topic);
  }

  openTopic(topic: Topic) {
    if (topic != undefined) {
      //redirect to detail page
    }
  }

  async createTopic() {
    //redirect to form
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    // if (role === 'confirm') {
    //   this.message = `Hello, ${data}!`;
    // }
  }
}
