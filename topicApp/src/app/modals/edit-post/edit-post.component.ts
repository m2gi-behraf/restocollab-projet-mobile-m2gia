import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  
  public postForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  public post = {} as Post
  
  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private postService: PostService,
    private navParams: NavParams) { }
  
  ngOnInit() {
    const postId: number = this.navParams.get('postId');

    console.log(postId); 

    if (this.postService.get(postId) != undefined){
      this.post = this.postService.get(postId) ?? this.post;
      this.postForm.value.name = this.post.name;
      this.postForm.value.description = this.post.description;

      console.log(this.postForm.value)
    }
  }
  
  onWillDismiss(event: Event) { }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  submitPostEdition(): boolean{
    if (!this.postForm.valid) {
      this.errorToast();
      return false;
    }

    const post = this.postService.edit(this.post, this.postForm.value.name ?? "", this.postForm.value.description ?? "");
    this.modalCtrl.dismiss(post, "confirm");
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
