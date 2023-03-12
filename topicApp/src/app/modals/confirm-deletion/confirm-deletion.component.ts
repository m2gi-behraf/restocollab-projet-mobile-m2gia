import {Component, inject, OnInit} from '@angular/core';
import {AlertController, IonicModule, ModalController, NavController, ToastController} from "@ionic/angular";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-confirm-deletion',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf],
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.scss'],
})
export class ConfirmDeletionComponent implements OnInit {
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  accountDeletionForm!: FormGroup;
  isSubmitted = false;
  handlerMessage = '';
  roleMessage = '';
  constructor(public navigationControl: NavController, private alertController: AlertController) { }

  ngOnInit() {
    this.accountDeletionForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Get form controls
   */
  get errorControl() {
    return this.accountDeletionForm.controls;
  }

  async submitForm(){
    this.isSubmitted = true;
    if (!this.accountDeletionForm.valid) {
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
      await this.presentAccountDeletionAlert();
    }
  }

  deleteAccount(email: string, password: string) {
    // todo
    this.toastController.create({
      message: "Account associated to the email address: " + email + " got successfully deleted.",
      duration: 1500,
      position: "bottom",
      color: 'success'
    }).then(async (toast) => {
      await toast.present();
    });
    this.modalController.dismiss(email, 'confirmed');
    this.navigationControl.navigateRoot('login');

  }
  dismissModal(email: string | null, status: 'confirmed' | 'canceled') {
    this.modalController.dismiss(email, status);
  }

  async presentAccountDeletionAlert() {
    const alert = await this.alertController.create({
      header: 'Account deletion is an irreversible action, are you sure you want to proceed?',
      buttons: [
        {
          text: 'Abort',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
            this.deleteAccount(this.accountDeletionForm.controls['email'].value, this.accountDeletionForm.controls['password'].value);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }
}
