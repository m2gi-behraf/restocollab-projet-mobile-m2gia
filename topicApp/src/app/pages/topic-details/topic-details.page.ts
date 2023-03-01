import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
import { TopicService } from 'src/app/services/topic.service';
import { CreatePostComponent } from './modals/create-post/create-post.component';

@Component({
  selector: 'app-topic-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    CreatePostComponent,
    NgFor
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear" color="primary" [routerLink]="['/']">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{topic?.name}}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <ion-list>
        <!-- Sliding item with text options on both sides -->
        <ion-item-sliding *ngFor="let post of topic?.posts">
          <ion-item [routerLink]="['/post-details/' + post.id ]" routerLinkActive="active" lines="none">
            <ion-label>{{ post.name }}</ion-label>
          </ion-item>
          
          <ion-item-options side="end">
            <ion-item-option (click)="delete(topic!, post)" color="danger">
              <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-fab horizontal="end" vertical="bottom" slot="fixed">
        <ion-fab-button (click)="openCreatePostModal()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    `,
  styles: [],
})
export class TopicDetailsPage implements OnInit, OnDestroy {
 
  ngOnDestroy(): void {
    this.destroy$.next()
  }
  
  topicId: string | null = null;
  topic: Topic | null = null;
  destroy$ = new Subject<void>()

  private topicService = inject(TopicService);
  private modalCtrl = inject(ModalController);
  private toastController = inject(ToastController);
  private route = inject(ActivatedRoute);

  /**
   * Fetch all the current topic according to the topicId during the ngOnInit hook
   */
  ngOnInit(): void {
    const topicId = this.route.snapshot.params['topicId'];
    this.topicService.findOne(topicId as string)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((topic) => {
        this.topic = topic
        console.log(this.topicService.getAllPosts(topic?.id ?? ""))
      })
    
      
  }

  /**
   * Method made to delete the given {Topic} and fetch the new list
   *
   * @param topic {Topic} the {Topic} to delete
   */
  delete(topic: Topic, post: Post): void {
    this.topicService.deletePost(topic.id, post);
  }

  /**
   * Method made to open the {CreateTopicComponent} in order to create a new {Topic}.
   *  - If the {CreateTopicComponent} is closed with the role `confirmed`,
   *  it creates a new Topic with the returned data and fetch the new list.
   *  - If the {CreateTopicComponent} is closed with the role `canceled`,
   *  it does nothing.
   */
  async openCreatePostModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirmed') {
      this._addPost(data);
      this._fetchTopic();
    }
  }

  /**
   * @private method to fetch the {Topic} given the topicId in the URL
   */
  private _fetchTopic(): void { }

  /**
   * @private method to create a new {Post}
   *
   * @param post {Post} the {Post} to add to the {Post} list in the current {Topic}
   */
  private async _addPost(post: Post): Promise<void> {
    try {
      this.topicService.createPost(this.topicId as string, post);

      const toast = await this.toastController.create({
        message: `Post ${post.name} successfully added`,
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: `Failed adding Post ${post.name}`,
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

}
