import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ShareRestaurantComponent} from "../share-restaurant/share-restaurant.component";
@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss'],
})
export class RestaurantDetailsComponent implements OnInit {

  restaurantId: number | undefined;
  thumbnailURL: string = "";
  restaurantName: string = "";
  restaurantRanking: string = "";
  restaurantCuisine: string = "";

  restaurantAddress: string = "";

  restaurantDescription: string = "";
  private modalController = inject(ModalController);

  constructor() { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  async shareRestaurant(
                              thumbnailURL: string,
                              restaurantName: string,
                              restaurantRanking: string,
                              restaurantCuisine: string,
                              restaurantAddress: string,
                              restaurantDescription: string) {
    const modal = await this.modalController.create({
      component: ShareRestaurantComponent,
      componentProps: {
        thumbnailURL: thumbnailURL,
        restaurantName: restaurantName,
        restaurantRanking: restaurantRanking,
        restaurantCuisine: restaurantCuisine,
        restaurantAddress: restaurantAddress,
        restaurantDescription: restaurantDescription
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
}
