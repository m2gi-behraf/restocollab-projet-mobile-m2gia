import { NgIf } from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  forgotPasswordForm!: FormGroup;
  isSubmitted= false;
  constructor() { }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });
  }

  /**
   * Get form controls
   */
  get errorControl() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * Check all the mandatory fields, and call forgotPassword() if good.
   */
  async submitForm(){
    this.isSubmitted = true;
    if (!this.forgotPasswordForm.valid) {
      this.toastController.create({
        message: "Please make sure you provided all required values correctly.",
        duration: 1500,
        position: "bottom",
        color: 'danger'
      }).then(async (toast) => {
        await toast.present();
      });
    }
    else {
      this.forgotPassword(this.forgotPasswordForm.controls['email'].value);
    }
  }

  /**
   * Appelle le reset de mot de passe
   * @param email email for reset
   */
  private forgotPassword(email: string) {
    this.authService.ForgotPassword(email)
      .then(() => {
        this.toastController.create({
          message: "Reset password link sent to " + email,
          duration: 1500,
          position: "bottom",
          color: 'success'
        }).then(async (toast) => {
          await toast.present();
        });
        this.modalController.dismiss(email, 'confirmed');
      })
      .catch((error) => {
        console.error(error);
        this.toastController.create({
          message: "An error occurred while sending email, please be sure you provided the good address",
          duration: 1500,
          position: "bottom",
          color: 'Danger'
        }).then(async (toast) => {
          await toast.present();
        });
        this.modalController.dismiss(email, 'canceled');
      })
  }

  /**
   * Public method to dismiss the modal
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
