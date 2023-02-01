import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { throws } from 'assert';
import { EditPostComponent } from 'src/app/modals/edit-post/edit-post.component';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {

  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,) { }

  public post = {} as Post
  public id: number = -1;
  public description: string = "";
  public topicId: string = "";

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id') ?? "-1");
    this.post = this.postService.get(this.id) ?? this.post;
  }

  /**
   * Ouvre le formulaire d'édition de post
   */
  async editPost() {
    const modal = await this.modalCtrl.create({
      component: EditPostComponent,
      componentProps: {
        postId: this.id
      }
    });
    await modal.present();
    
    modal.onDidDismiss()
      .then((data) => {
        this.post = (data['data'] as Post);
        console.log(data);
    });
  }

}
