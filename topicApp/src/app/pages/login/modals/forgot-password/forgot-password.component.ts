import { NgIf } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import {AuthService} from "../../../../services/auth.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  private tostController = inject(ToastController);
  private modalController = inject(ModalController);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  forgotPwdForm!: FormGroup;
  isSubmitted= false;
  constructor() { }

  ngOnInit() {
    this.forgotPwdForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]
    });
  }

  get errorControl() {
    return this.forgotPwdForm.controls;
  }

  async submitForm(){
    this.isSubmitted = true;
    if (!this.forgotPwdForm.valid) {
      this.tostController.create({
        message: "Please make sure you provided all required values correctly.",
        duration: 1500,
        position: "bottom",
        color: 'danger'
      }).then(async (toast) => {
        await toast.present();
      });
    }
    else {
      this.forgotPassword(this.forgotPwdForm.controls['email'].value);
    }
  }

  /**
   * Appelle le reset de mot de passe
   * @param email email for reset
   */
  private forgotPassword(email: string) {
    this.authService.ForgotPassword(email)
      .then(() => {
        this.modalController.dismiss(email, 'confirmed');
      })
      .catch((error) => {
        console.error(error);
        this.modalController.dismiss(email, 'canceled');
      })
  }

  /**
   * Public method to dissmiss the modal
   *
   * @param email
   * @param status the {string} of the status on how is closed the modal,
   * - it can be 'confirmed' if the modal is closed by a form submition.
   * - it can be 'canceled' if the modal is close by the close button.
   */
  dismissModal(email: string | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(email, status);
  }
}
