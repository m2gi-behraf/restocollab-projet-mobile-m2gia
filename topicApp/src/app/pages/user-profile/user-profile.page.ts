import {Component, inject, OnInit} from '@angular/core';
import {ModalController, NavController, ToastController} from "@ionic/angular";
import {ConfirmDeletionComponent} from "../../modals/confirm-deletion/confirm-deletion.component";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/User";
import {AuthenticationMethod} from "../../models/Enums/AuthenticationMethod";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private userService = inject(UserService)
  private authService = inject(AuthService)
  user = this.userService.currentUser

  constructor(public navigationControl: NavController) { }

  ngOnInit() { }

  async deleteAccount() {
    const modal = await this.modalController.create({
      component: ConfirmDeletionComponent,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }

  async logout() {
    await this.authService.signOut();
    await this.navigationControl.navigateRoot('login');
    this.toastController.create({
      message: "Account session successfully terminated. You are now logged out.",
      duration: 1500,
      position: "bottom",
      color: 'success'
    }).then(async (toast) => {
      await toast.present();
    });
  }

  signInByEmail(user: User){
    return user.authenticationMethod == AuthenticationMethod.EMAIL;
  }
}
