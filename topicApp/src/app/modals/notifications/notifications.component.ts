import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  private modalController = inject(ModalController);
  notificationsList = [
    {type: "friend-request", message: "Laura sent you a friend request!"},
    {type: "read-write-invitation", message: "Jad invited you to collaborate on a restaurant list!"},
    {type: "read-only-invitation", message: "Josh invited you to view his restaurant list!"},
  ];

  constructor() { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  goToNotification(notificationType: string) {
    // todo: implement navigation to relevant/concerned page/section of said notification
    // todo: would be interesting to implement an interface/class/enum class for the notification object when setting up the service
    switch (notificationType) {
      case "friend-request": {
        console.log("it's a friend request");
        break;
      }
      case "read-only-invitation": {
        console.log("it's a read-only invitation!");
        break;
      }
      case "read-write-invitation": {
        console.log("it's a read-write invitation!");
        break;
      }
      default: {
        break;
      }
    }
    console.log(notificationType);
  }
}
