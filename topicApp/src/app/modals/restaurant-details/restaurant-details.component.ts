import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ShareRestaurantComponent} from "../share-restaurant/share-restaurant.component";
import {Restaurant} from "../../models/Restaurant";
@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss'],
})
export class RestaurantDetailsComponent implements OnInit {

  restaurant: Restaurant = {} as Restaurant;
  private modalController = inject(ModalController);

  constructor() { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  async shareRestaurant() {
    const modal = await this.modalController.create({
      component: ShareRestaurantComponent,
      componentProps: {
        thumbnailURL: this.restaurant.imageURL,
        restaurantName: this.restaurant.name,
        restaurantRanking: this.restaurant.ranking,
        restaurantCuisine: this.restaurant.cuisine,
        restaurantAddress: this.restaurant.address,
        restaurantDescription: this.restaurant.description
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
}
