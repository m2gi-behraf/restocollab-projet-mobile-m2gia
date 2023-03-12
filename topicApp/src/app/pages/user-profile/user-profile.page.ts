import {Component, inject, OnInit} from '@angular/core';
import {ModalController, NavController, ToastController} from "@ionic/angular";
import {ConfirmDeletionComponent} from "../../modals/confirm-deletion/confirm-deletion.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

  constructor(public navigationControl: NavController) { }

  ngOnInit() {
  }

  async deleteAccount() {
    const modal = await this.modalController.create({
      component: ConfirmDeletionComponent,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }

  async logout() {
    // todo terminate account session via firebase
    this.toastController.create({
      message: "Account session successfully terminated. You are now logged out.",
      duration: 1500,
      position: "bottom",
      color: 'success'
    }).then(async (toast) => {
      await toast.present();
    });
    await this.navigationControl.navigateRoot('login');
  }
}
