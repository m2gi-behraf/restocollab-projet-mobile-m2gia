import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
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
  constructor(private socialSharing: SocialSharing) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  shareElement(smedia: any) {

    // This feature is left out at the moment because you need to run it
    // on a device that actually has WhatsApp installed on it.

    // if (smedia === "email") {
    //   this.socialSharing.shareViaEmail("Restaurant name: " + this.restaurant.name
    //     + "\nRanking: " + this.restaurant.ranking
    //     + "\nCuisine: " + this.restaurant.cuisine
    //     + "\nAddress: " + this.restaurant.address
    //     + "\nDescription: " + this.restaurant.description,
    //     "I'd like to share a cool restaurant with you!", ["insert@email.here"],undefined,undefined, this.restaurantThumbnailURL
    //   ).then((res) => {
    //     console.log("Share via Email successful!");
    //   }).catch((error) => {
    //     alert(JSON.stringify(error));
    //   })
    // }

    if (smedia == "email")
      console.log("Sharing via email is coming in v2.0");

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

    // This feature is left out at the moment because you need to run it
    // on a device that actually has WhatsApp installed on it.

    // if (smedia == "whatsapp") {
    //   this.socialSharing.shareViaWhatsApp("Hey, I'd like to share this cool restaurant with you!"
    //     + "\nRestaurant name: " + this.restaurant.name
    //     + "\nRanking: " + this.restaurant.ranking
    //     + "\nCuisine: " + this.restaurant.cuisine
    //     + "\nAddress: " + this.restaurant.address
    //     + "\nDescription: " + this.restaurant.description,
    //     this.restaurantThumbnailURL).then((res) => {
    //       console.log("Share via Whatsapp successful!");
    //   }).catch((error) => {
    //     alert(JSON.stringify(error));
    //   })
    // }

    if (smedia == "whatsapp")
      console.log("Sharing via Whatsapp is coming in v2.0");
  }
}
