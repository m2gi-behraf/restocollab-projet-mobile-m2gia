import {Component, inject, OnInit} from '@angular/core';
import {ForgotPasswordComponent} from "../../modals/forgot-password/forgot-password.component";
import {ModalController, NavController} from "@ionic/angular";
import {NotificationsComponent} from "../../modals/notifications/notifications.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor(public navigationControl: NavController) { }

  ngOnInit() {}

  async showNotifications() {
    const modal = await this.modalController.create({
      component: NotificationsComponent,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  goToUserProfile() {
    this.navigationControl.navigateForward('dashboard/tabs/user-profile')
  }
}
