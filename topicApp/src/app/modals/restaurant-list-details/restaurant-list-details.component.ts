import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {RestaurantsList} from "../../models/RestaurantsList";
import {AlertController, IonicModule, ModalController} from "@ionic/angular";
import {Restaurant} from "../../models/Restaurant";
import {User} from "../../models/User";
import {ModifyRestaurantListComponent} from "../modify-restaurant-list/modify-restaurant-list.component";

@Component({
  selector: 'app-restaurant-list-details',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './restaurant-list-details.component.html',
  styleUrls: ['./restaurant-list-details.component.scss'],
})
export class RestaurantListDetailsComponent implements OnInit {
  private restaurantsListService = inject(RestaurantsListService)
  private modalController = inject(ModalController)
  private alertController = inject(AlertController)
  alertHandlerMessage = '';
  alertRoleMessage = '';
  restaurantsList: RestaurantsList = {} as RestaurantsList;
  restaurants$: Observable<Restaurant[]> = EMPTY;
  collaborators$: Observable<User[]> = EMPTY;
  constructor() { }

  ngOnInit() {
    this.restaurants$ = this.restaurantsListService.findAllRestaurants(this.restaurantsList.id);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async presentRestaurantListDeletionAlert() {
    const alert = await this.alertController.create({
      header: "You're about to delete: " + this.restaurantsList.name + "\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + this.restaurantsList.name + ". ",
          role: 'confirm',
          handler: () => {
            this.alertHandlerMessage = 'Deletion confirmed!';
            this.restaurantsListService.delete(this.restaurantsList);
          },
        },
        {
          text: "Abort",
          role: 'cancel',
          handler: () => {
            this.alertHandlerMessage = 'Deletion aborted. Alert canceled!';
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.alertRoleMessage = `Dismissed with role: ${role}`;
  }

  async showModifyRestaurantList() {
    const modal = await this.modalController.create({
      component: ModifyRestaurantListComponent,
      componentProps: {
        myPermission: "owner", //Todo link permissions
        restaurantsList: this.restaurantsList
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

}
