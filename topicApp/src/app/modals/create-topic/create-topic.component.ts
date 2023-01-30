import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss'],
})
export class CreateTopicComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private topicService: TopicService) { }

  topicForm = new FormGroup({
    name: new FormControl('', Validators.required),
    posts: new FormControl(new Array())
  });

  availablePosts: Post[] = new Array()

  ngOnInit() { }

  onSubmit() { }

  onWillDismiss(event: Event) { }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel')
  }

  /**
   * Valide la création du topic et ferme la modal
   * @returns Vrai si les champs nécessaires ont été remplis, faux sinon.
   */
  confirm(): boolean {
    if (!this.topicForm.valid) {
      this.errorToast();
      return false;
    }

    const topic = this.topicService.create(this.topicForm.value.name ?? "", this.topicForm.value.posts ?? new Array());
    this.modalCtrl.dismiss(topic, "confirm");
    return true;
  }

  /**
   * Affiche un toast d'erreur
   */
  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Veuillez remplir les champs obligatoires',
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }
}
