import {Component, inject, OnInit} from '@angular/core';
import {ModalController, NavController} from "@ionic/angular";
import {NotificationsComponent} from "../../modals/notifications/notifications.component";
import {UserService} from "../../services/user.service";
import {MyCollaborationsComponent} from "../../modals/my-collaborations/my-collaborations.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private modalController = inject(ModalController);
  private userService = inject(UserService)

  user = this.userService.currentUser
  constructor(public navigationControl: NavController) { }

  ngOnInit() {}

  async showNotifications() {
    const modal = await this.modalController.create({
      component: NotificationsComponent,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  async showMyCollaborations() {
    const modal = await this.modalController.create({
      component: MyCollaborationsComponent,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
  goToUserProfile() {
    this.navigationControl.navigateForward('dashboard/tabs/user-profile')
  }
}
