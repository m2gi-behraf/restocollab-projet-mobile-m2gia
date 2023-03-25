import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {CreateRestaurantListComponent} from "../create-restaurant-list/create-restaurant-list.component";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {EMPTY, Observable} from "rxjs";
import {RestaurantsList} from "../../models/RestaurantsList";
import { UserService } from 'src/app/services/user.service';
import {RestaurantListDetailsComponent} from "../restaurant-list-details/restaurant-list-details.component";

@Component({
  selector: 'app-my-collaborations',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf, AsyncPipe, DatePipe],
  templateUrl: './my-collaborations.component.html',
  styleUrls: ['./my-collaborations.component.scss'],
})
export class MyCollaborationsComponent implements OnInit {

  private modalController = inject(ModalController);
  private restaurantsListService = inject(RestaurantsListService);
  private userService = inject(UserService);

  myRestaurantsList$: Observable<RestaurantsList[]> = EMPTY;
  sharedWithMeRestaurantsList$: Observable<RestaurantsList[]> = EMPTY;

  constructor() {}

  ngOnInit() {
    this.myRestaurantsList$ = this.restaurantsListService.findMine()
    this.sharedWithMeRestaurantsList$ = this.restaurantsListService.findSharedWithMe()
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async goToDetails(list: RestaurantsList) {
    const modal = await this.modalController.create({
      component: RestaurantListDetailsComponent,
      componentProps: {
        restaurantsList: list
        }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  async showCreateRestaurantList() {
    const modal = await this.modalController.create({
      component: CreateRestaurantListComponent,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  /**
   * return size of map
   * @param map map
   */
  getNbEntries(map: Map<string,string>) : number {
    return Object.keys(map).length;
  }

  getMyPermission(list: RestaurantsList) : string {
    let userId = this.userService.currentUser.id
    return this.restaurantsListService.getPermission(list, userId);
  }
}
