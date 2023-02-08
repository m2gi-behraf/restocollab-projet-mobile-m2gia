import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf],
  template: `
  <form [formGroup]="createPostForm" (ngSubmit)="createPost()" novalidate>
  <ion-header translucent>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button fill="clear" color="primary" (click)="dismissModal(null, 'canceled')">Close</ion-button>
      </ion-buttons>
      <ion-title>Modal Content</ion-title>
      <ion-buttons slot="end">
        <ion-button fill="clear" color="primary" [disabled]="createPostForm.invalid" type="submit">
          <ion-icon name="checkmark-outline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  
  <ion-content fullscreen>
    <ion-item lines="full">
      <ion-label position="floating">Name</ion-label>
      <ion-input type="text" name="name" formControlName="name"></ion-input>
    </ion-item>
    <ion-text color="danger" *ngIf="controls['name'].touched && controls['name'].errors?.['required']">
      <span>
        This field is required
      </span>
    </ion-text>
    <ion-text color="danger" *ngIf="controls['name'].touched && controls['name'].errors?.['minlength']">
      <span>
        Minimum length 2
      </span>
    </ion-text>

    <ion-item lines="full">
      <ion-label position="floating">Description</ion-label>
      <ion-textarea type="text" name="description" formControlName="description"></ion-textarea>
    </ion-item>
  </ion-content>
</form>
  `,
  styles: [],
})
export class CreatePostComponent implements OnInit {

  createPostForm!: FormGroup;

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder) {

  }

  /**
   * Getter for the {FormGroup} controls
   */
  get controls() {
    return this.createPostForm.controls;
  }

  /**
   * Creates the {FormGroup} during the ngOnInit hook.
   * The {FormGroup} has the given controls :
   *
   * - name: a {string}, which should be not null and has a min length of 2.
   * - description: a {string}.
   */
  ngOnInit() {
    this.createPostForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  /**
   * Public method to dissmiss the modal
   *
   * @param post the {Post} to return
   * @param status the {string} of the status on how is closed the modal,
   * - it can be 'confirmed' if the modal is closed by a form submition.
   * - it can be 'canceled' if the modal is close by the close button.
   */
  dismissModal(post: Post | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(post, status);
  }

  /**
   * Public method to create a {Modal} and call the methods that will give close the modal
   * with the status 'confirmed' and the given {Modal}
   */
  createPost() {
    if (this.createPostForm.valid) {
      const post: Post = {
        ...this.createPostForm.value,
        id: Date.now().toString() + (Math.random() * 100).toFixed()
      };
      this.dismissModal(post, 'confirmed');
    }
  }
}
