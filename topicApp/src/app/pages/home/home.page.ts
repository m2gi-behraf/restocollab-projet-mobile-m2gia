import {Component, inject, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {RestaurantDetailsComponent} from "../../modals/restaurant-details/restaurant-details.component";
import {BehaviorSubject, EMPTY, Observable, switchMap} from "rxjs";
import {Restaurant} from "../../models/Restaurant";
import {RestaurantService} from "../../services/restaurant.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private modalController = inject(ModalController)
  private restaurantService = inject(RestaurantService)
  restaurants$: Observable<Restaurant[] | null> = EMPTY
  searchText$: BehaviorSubject<string> = new BehaviorSubject("");
  filterRestaurantName: any;
  constructor() { }

  ngOnInit() {
    this.restaurants$ = this.restaurantService.findAll().pipe(
      switchMap(() => this.searchText$, (restaurants, filter) => restaurants.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    ));
  }

  search(value: any) {
    this.searchText$.next(value)
  }

  /**
   * Show a modal of the restaurant
   * @param restaurant restaurant to show
   */
  async showRestaurantDetails(restaurant: Restaurant) {
    const modal = await this.modalController.create({
      component: RestaurantDetailsComponent,
      componentProps: { restaurant }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
}
