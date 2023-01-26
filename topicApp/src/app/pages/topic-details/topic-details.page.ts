import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Console } from 'console';
import { CreatePostComponent } from 'src/app/modals/create-post/create-post.component';
import { Post } from 'src/app/models/post';
import { Topic } from 'src/app/models/topic';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.page.html',
  styleUrls: ['./topic-details.page.scss'],
})
export class TopicDetailsPage implements OnInit {

  constructor(private route: ActivatedRoute,
    private topicService: TopicService,
    private postService: PostService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  public id: string = "";
  public topic = {} as Topic;
  public posts = new Array();

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? "whatever";
    this.topic = this.topicService.findOneById(Number(this.id)) ?? this.topic;
    this.posts = this.postService.getAll(this.topic);
    console.log(this.posts);
  }

  fetchAllPosts(): Post[] {
    return this.postService.getAll(this.topic);
  }

  async createPost() {
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
      componentProps: {
        id: this.id,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    let post = data as Post;

    if (role === 'confirm') {
      let toast = await this.toastController.create({
        message: `La post \'${post.name}'\ a été ajouté !`,
        duration: 3000,
        position: 'bottom',
        icon: 'checkmark-outline',
        color: 'success'
      });

      await toast.present()
    }
  }

  async deletePost(post: Post) {
    if (post != undefined) {
      let alert = await this.alertController.create({
        message: `Confirmez-vous la suppression de ${post.name} ?`,
        header: '⚠️ Attention',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'primary',
            handler: (blah) => { }
          }, {
            text: 'Supprimer',
            cssClass: 'secondary',
            handler: async (blah) => {
              this.postService.delete(post, this.topic);
              let toast = await this.toastController.create({
                message: `La post \'${post.name}'\ a été supprimé !`,
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
}
