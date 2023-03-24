import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AlertController, IonicModule, ModalController} from "@ionic/angular";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {CreateRestaurantListComponent} from "../create-restaurant-list/create-restaurant-list.component";
import {ModifyRestaurantListComponent} from "../modify-restaurant-list/modify-restaurant-list.component";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {EMPTY, Observable} from "rxjs";
import {Restaurant} from "../../models/Restaurant";
import {RestaurantsList} from "../../models/RestaurantsList";
import {User} from "../../models/User";
import { UserService } from 'src/app/services/user.service';

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
  readonly mapRoleLabel = new Map([
    ["owner", "owner"],
    ["writer", "collaborator"],
    ["reader", "reader"],
  ])

  myRestaurantsList$: Observable<RestaurantsList[] | null> = EMPTY;
  sharedWithMeRestaurantsList$: Observable<RestaurantsList[] | null> = EMPTY;

  alertHandlerMessage = '';
  alertRoleMessage = '';

  // todo: replace the hard-coded lists with the appropriate service implementation
  yourRestaurantsLists = [
    { listID: 1,
      listName: "My favourite restaurants",
      dateOfCreation: "19/03/2023",
      myPermission: "owner",
      restaurants: [
        {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        ],
      collaborators: [
        { id: 1, username: "Josh", isReadOnly: true, isCollab: false, },
        { id: 2, username: "Jona", isReadOnly: false, isCollab: true  }
      ]
    },
    { listID: 2,
      listName: "My favourites",
      dateOfCreation: "01/01/2023",
      myPermission: "owner",
      restaurants:
        [ {id: 7, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
          {id: 8, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
          {id: 9, thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        ],
      collaborators: [
        { id: 1, username: "Lana", isReadOnly: true, isCollab: false },
        { id: 2, username: "Patrick", isReadOnly: false, isCollab: true },
        { id: 3, username: "Ariana", isReadOnly: false, isCollab: true },
      ]
    },
  ];

  sharedWithMeRestaurantLists = [
    {
      sharedListID: 1,
      sharedListName: "A dear friend's list",
      sharedListAuthor: "Kevin",
      dateOfCreation: "19/03/2023",
      myPermission: "read-only",
      restaurants: [
        {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
      ],
      collaborators: [
        { id: 1, username: "Lana", isReadOnly: true, isCollab: false },
        { id: 2, username: "Patrick", isReadOnly: false, isCollab: true },
        { id: 3, username: "Ariana", isReadOnly: false, isCollab: true },
        { id: 4, username: "Me", isReadOnly: true, isCollab: false },
      ]
    },
    {
      sharedListID: 2,
      sharedListName: "My favourite restaurants this year",
      sharedListAuthor: "Marina",
      dateOfCreation: "23/03/2023",
      myPermission: "read-write",
      restaurants: [
        {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
      ],
      collaborators: [
        { id: 4, username: "Me", isReadOnly: false, isCollab: true },
      ]
    }
  ];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.myRestaurantsList$ = this.restaurantsListService.findMine()
    this.sharedWithMeRestaurantsList$ = this.restaurantsListService.findSharedWithMe()
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  //todo: implement expansion of shared list in another modal
  //todo: view in more details (restaurants list and collaborators list)
  //todo: if your permissions are "read-write" then display add button to the list
  async goToSharedList(id: string) {
    id = "XYJ5fpjqXUeW4aVdfDFR"
    let list = await firstValueFrom(this.restaurantsListService.findOne(id));

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

  deleteRestaurantList(restaurantListID: number, restaurantListName: string) {
    //todo deleteRestaurantsList by service
  }

  async presentRestaurantListDeletionAlert(restaurantsList: RestaurantsList) {
    const alert = await this.alertController.create({
      header: "You're about to delete: " + restaurantsList.name + "\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + restaurantsList.name + ". ",
          role: 'confirm',
          handler: () => {
            this.alertHandlerMessage = 'Deletion confirmed!';
            this.restaurantsListService.delete(restaurantsList);
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

  /**
   * Return all collaborators of the given list
   * @param restaurantsList restaurantsList
   */
  getCollaborators(restaurantsList: RestaurantsList) : Observable<User[]> {
    return this.userService.getUsers(Array.from(Object.keys(restaurantsList.roles)))
  }

  // async showModifyRestaurantList(restaurantsList: RestaurantsList) {
  //   const collaborators = restaurantsList.collaborators.map((collaborator) => {
  //     return {
  //       id: collaborator.id,
  //       username: collaborator.username,
  //       isReadOnly: collaborator.isReadOnly,
  //       isCollab: collaborator.isCollab
  //     }
  //   }) ?? [];
  //
  //   const restaurants = matchingRestaurantList?.restaurants?.map((restaurant) => {
  //     return {
  //       id: restaurant.id,
  //       thumbnailURL: restaurant.thumbnailURL,
  //       restaurantName: restaurant.restaurantName,
  //       ranking: restaurant.ranking,
  //       cuisine: restaurant.cuisine,
  //       address: restaurant.address,
  //       description: restaurant.description
  //     }
  //   }) ?? [];
  //
  //   const modal = await this.modalController.create({
  //     component: ModifyRestaurantListComponent,
  //     componentProps: {
  //       matchingRestaurantList: matchingRestaurantList,
  //       restaurantListName: matchingRestaurantList?.listName,
  //       restaurantsList: restaurants,
  //       restaurantsListCollaborators: collaborators,
  //     }
  //   });
  //   await modal.present();
  //   const { data, role } = await modal.onWillDismiss();
  // }

}
