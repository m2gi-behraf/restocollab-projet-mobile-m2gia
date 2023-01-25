import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CreatePostComponent } from '../modals/create-post/create-post.component';
import { CreateTopicComponent } from '../modals/create-topic/create-topic.component';
import { Topic } from '../models/topic';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private topicService: TopicService, 
    private modalCtrl: ModalController,
    private toastController: ToastController) {
  }

  fetchAllTopics(): Array<Topic> {
    return this.topicService.findAll();
  }

  async deleteTopic(topic: Topic) {
    if (topic != undefined){
      this.topicService.delete(topic);
      let toast = await this.toastController.create({
        message: `Le topic \'${topic.name}'\ a été supprimé !`, 
        duration: 3000,
        position: 'bottom',
        icon: 'checkmark-outline',
        color: 'success'
      });
      await toast.present()
    }
  }

  openTopic(topic: Topic) {
    if (topic != undefined) {
      //redirect to detail page
    }
  }

  /**
   * Ouvre la modal de création de topic, ajoute le topic créé après validation.
   */
  async createTopic() {
    const modal = await this.modalCtrl.create({
      component: CreateTopicComponent,
      //component: CreatePostComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    let topic = data as Topic;

    if (role === 'confirm'){
      let toast = await this.toastController.create({
        message: `Le topic \'${topic.name}'\ a été ajouté !`, 
        duration: 3000,
        position: 'bottom',
        icon: 'checkmark-outline',
        color: 'success'
      });
      
      await toast.present()
    }
  }
}
