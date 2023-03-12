import {Component, inject, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ConfirmDeletionComponent} from "../../modals/confirm-deletion/confirm-deletion.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  private modalController = inject(ModalController);


  constructor() { }

  ngOnInit() {
  }

  async deleteAccount() {
    const modal = await this.modalController.create({
      component: ConfirmDeletionComponent,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }
}
