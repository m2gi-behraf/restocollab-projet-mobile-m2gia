import {Component, inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {EMPTY, Observable} from "rxjs";
import {RestaurantsList} from "../../models/RestaurantsList";
import {AlertController, IonicModule, ModalController, ToastController} from "@ionic/angular";
import {Restaurant} from "../../models/Restaurant";
import {User} from "../../models/User";
import {ModifyRestaurantListComponent} from "../modify-restaurant-list/modify-restaurant-list.component";

@Component({
  selector: 'app-restaurant-list-details',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf, AsyncPipe, DatePipe],
  templateUrl: './restaurant-list-details.component.html',
  styleUrls: ['./restaurant-list-details.component.scss'],
})
export class RestaurantListDetailsComponent implements OnInit {
  private role: string = "reader"
  private restaurantsListService = inject(RestaurantsListService)
  private userService = inject(UserService)
  private modalController = inject(ModalController)
  private alertController = inject(AlertController)
  private toastController = inject(ToastController)

  restaurantsList: RestaurantsList = {} as RestaurantsList;
  restaurants$: Observable<Restaurant[]> = EMPTY;
  collaborators$: Observable<User[]> = EMPTY;
  constructor() { }

  ngOnInit() {
    this.restaurants$ = this.restaurantsListService.findAllRestaurants(this.restaurantsList.id);
    this.collaborators$ = this.userService.findAllById(Object.keys(this.restaurantsList.roles));

    //Get role
    const keys = Object.keys(this.restaurantsList.roles)
    const values = Object.values(this.restaurantsList.roles)
    let index = keys.indexOf(this.userService.currentUser.id);
    this.role = values[index]
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  /**
   * Return if the current user is owner or writer on the list
   */
  get canModify(): boolean {
    return this.role == 'owner' || this.role == 'writer';
  }

  get isOwner(): boolean {
    return this.role == 'owner';
  }

  async goToModifyRestaurantList() {
    const modal = await this.modalController.create({
      component: ModifyRestaurantListComponent,
      componentProps: {
        myPermission: this.role,
        restaurantsList: this.restaurantsList
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(role);
    if (role == 'deleted'){
      console.log('dismissing modal')
      this.dismissModal();
    }
  }

  /**
   * Delete the current list
   */
  async deleteRestaurantList() {
    const alert = await this.alertController.create({
      header: "You're about to delete the list: " + this.restaurantsList.name + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + this.restaurantsList.name + ". ",
          role: 'confirm'
        },
        {
          text: "Abort",
          role: 'cancel',
        },
      ],
    });
    await alert.present()
    const {role} = await alert.onDidDismiss();

    if (role === 'confirm') {
      await this.restaurantsListService.delete(this.restaurantsList);
      this.dismissModal();
      this.toastController.create({
        message: "Restaurant list deletion successful!",
        duration: 1500,
        position: "bottom",
        color: 'success'
      }).then(async (toast) => {
        await toast.present()
      });
    }
    else{
      console.log('Deletion aborted')
    }
  }

  getPermission(user: User): string {
    return this.restaurantsListService.getPermission(this.restaurantsList, user.id);
  }
}
