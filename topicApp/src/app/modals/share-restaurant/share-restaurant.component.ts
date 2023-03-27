import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import { SocialSharing} from "@awesome-cordova-plugins/social-sharing/ngx";
import {Restaurant} from "../../models/Restaurant";
@Component({
  selector: 'app-share-restaurant',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './share-restaurant.component.html',
  styleUrls: ['./share-restaurant.component.scss'],
})
export class ShareRestaurantComponent implements OnInit {
  private modalController = inject(ModalController);
  restaurant: Restaurant = {} as Restaurant;
  private toastController = inject(ToastController);
  constructor(private socialSharing: SocialSharing) { }
  ngOnInit() {}
  dismissModal() {
    this.modalController.dismiss();
  }
  shareElement(smedia: any) {
    if (smedia == "sms") {
      this.socialSharing.shareViaSMS("Hey, I'd like to share this cool restaurant with you!"
        + "\nRestaurant name: " + this.restaurant.name
        + "\nRanking: " + this.restaurant.ranking
        + "\nCuisine: " + this.restaurant.cuisine
        + "\nAddress: " + this.restaurant.address
        + "\nDescription: " + this.restaurant.description,
        "00000000").then((res) => {
          console.log("Share via SMS successful!");
      }).catch((error) => {
        alert(JSON.stringify(error));
      })
    }

    if (smedia == "whatsapp")
      this.toastController.create({
        message: "Sharing via Whatsapp is coming in v2.0",
        duration: 1500,
        position: "bottom",
        color: 'medium'
      }).then(async (toast) => {
        await toast.present();
      });
  }
}
