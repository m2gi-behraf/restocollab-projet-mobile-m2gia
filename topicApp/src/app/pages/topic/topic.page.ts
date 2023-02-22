import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CreateTopicComponent } from 'src/app/pages/topic/modals/create-topic/create-topic.component';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { RouterModule } from '@angular/router';
import { AsyncPipe, NgFor } from '@angular/common';
import { BehaviorSubject, EMPTY, map, Observable, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, RouterModule, CreateTopicComponent, NgFor, AsyncPipe],
  template: `
  <ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      Topics
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
<ion-searchbar placeholder="Search Topic" (ionChange)="search($any($event.target).value)"></ion-searchbar>
  <ion-list>
    <!-- Sliding item with text options on both sides -->
    <ion-item-sliding *ngFor="let topic of topics$ | async">
      <ion-item [routerLink]="['/topic/' + topic.id ]" routerLinkActive="active" lines="none">
        <ion-label>{{ topic.name }}</ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option (click)="delete(topic)" color="danger">
          <ion-icon slot="icon-only" name="trash"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
  <ion-fab horizontal="end" vertical="bottom" slot="fixed">
    <ion-fab-button (click)="openCreateTopicModal()">
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</ion-content>
  `,
  styles: [`
  #container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
  `],
})
export class TopicPage implements OnInit {

  topics$: Observable<Topic[]> = EMPTY;
  public searchText$: BehaviorSubject<string> = new BehaviorSubject("");

  private topicService = inject(TopicService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);

  /**
   * Fetch all the topic during the ngOnInit hook
   */
  ngOnInit(): void {
    this.topicService.getAll().subscribe(res => console.log('getAll', res))
    //topics
    // this.topics$ = this.topicService.findAll().pipe(
    //   switchMap(() => this.searchText$, (topics, filter) => topics.filter(t => t.name.includes(filter))
    // ));
  }

  search(value: any) {
    this.searchText$.next(value)
  }

  /**
   * Method made to delete the given {Topic} and fetch the new list
   *
   * @param topic {Topic} the {Topic} to delete
   */
  delete(topic: Topic): void {
    this.topicService.delete(topic);
  }

  /**
   * Method made to open the {CreateTopicComponent} in order to create a new {Topic}.
   *  - If the {CreateTopicComponent} is closed with the role `confirmed`,
   *  it creates a new Topic with the returned data and fetch the new list.
   *  - If the {CreateTopicComponent} is closed with the role `canceled`,
   *  it does nothing.
   */
  async openCreateTopicModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateTopicComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this._createTopic(data);
    }
  }

  /**
   * @private method to create a new {Topic}
   *
   * @param topic {Topic} the {Topic} to add to the list
   */
  private async _createTopic(topic: Topic): Promise<void> {
    try {
      this.topicService.create(topic);

      const toast = await this.toastController.create({
        message: `Topic ${topic.name} successfully created`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: `Failed creating Topic ${topic.name}`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }
}
