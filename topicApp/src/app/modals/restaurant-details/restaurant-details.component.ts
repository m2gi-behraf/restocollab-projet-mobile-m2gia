import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss'],
})
export class RestaurantDetailsComponent implements OnInit {

  restaurantId: number | undefined;
  thumbnailURL: string | undefined;
  restaurantName: string | undefined;
  restaurantRanking: string | undefined;
  restaurantCuisine: string | undefined;

  restaurantAddress: string | undefined;

  restaurantDescription: string | undefined;
  private modalController = inject(ModalController);

  constructor() { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
