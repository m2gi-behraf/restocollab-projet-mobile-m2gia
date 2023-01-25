import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

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

  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() { }

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
      console.log("Add post creation here.");
      console.log("name: " + this.postForm.value.name);
      console.log("description: " + this.postForm.value.description);
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  }
}
