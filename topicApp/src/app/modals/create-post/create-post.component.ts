import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Topic } from 'src/app/models/topic';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit {

  postForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  public topic = {} as Topic;

  constructor(private modalCtrl: ModalController,
    private toastController: ToastController,
    private postService: PostService,
    private navParams: NavParams,
    private topicService: TopicService) { }

  ngOnInit() {
    const id: number = this.navParams.get('id');
    this.topic = this.topicService.findOneById(id) ?? this.topic;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.postForm, 'confirm');
  }

  async errorToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Please fill in all the necessarry information.',
      duration: 1500,
      position: position
    });
    await toast.present();
  }

  async successToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Post created successfully.',
      duration: 1500,
      position: position
    });
    await toast.present();
  }

  submitPostCreation() {
    if (!this.postForm.valid) {
      this.errorToast('bottom');
      return false;
    } else {
      this.successToast('bottom');
      this.postService.create(this.postForm.value.name ?? "", this.postForm.value.description ?? "", this.topic);
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  }
}
