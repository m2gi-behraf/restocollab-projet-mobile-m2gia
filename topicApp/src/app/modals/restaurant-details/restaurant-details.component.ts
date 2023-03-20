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

  public restaurant: Restaurant = {} as Restaurant;
  private modalController = inject(ModalController);

  constructor() { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  /**
   * Show modal to share restaurant.
   */
  async shareRestaurant() {
    const restaurant = this.restaurant;
    const modal = await this.modalController.create({
      component: ShareRestaurantComponent,
      componentProps: { restaurant }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
}
