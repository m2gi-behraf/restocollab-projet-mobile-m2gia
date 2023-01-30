import { Component } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
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
    private toastController: ToastController,
    private alertController: AlertController) {
  }

  fetchAllTopics(): Array<Topic> {
    return this.topicService.findAll();
  }

  /**
   * Demande confirmation et supprime le topic
   * @param topic Topic à supprimer
   */
  async deleteTopic(topic: Topic) {
    if (topic != undefined){
      let alert = await this.alertController.create({
        message: `Confirmez-vous la suppression de ${topic.name} ?`,
        header: '⚠️ Attention',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'primary',
            handler: (blah) => {}
          }, {
            text: 'Supprimer',
            cssClass: 'secondary',
            handler: async (blah) => {
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
        ]
      });
      await alert.present().then();
    }
  }

  /**
   * Ouvre la modal de création de topic, ajoute le topic créé après validation.
   */
  async createTopic() {
    const modal = await this.modalCtrl.create({
      component: CreateTopicComponent
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
