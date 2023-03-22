import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AlertController, IonicModule, ModalController} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import {CreateRestaurantListComponent} from "../create-restaurant-list/create-restaurant-list.component";
import {ModifyRestaurantListComponent} from "../modify-restaurant-list/modify-restaurant-list.component";

@Component({
  selector: 'app-my-collaborations',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf],
  templateUrl: './my-collaborations.component.html',
  styleUrls: ['./my-collaborations.component.scss'],
})
export class MyCollaborationsComponent implements OnInit {
  private modalController = inject(ModalController);
  alertHandlerMessage = '';
  alertRoleMessage = '';

  // todo: replace the hard-coded lists with the appropriate service implementation
  yourRestaurantsLists = [
    { listID: 1,
      listName: "My favourite restaurants",
      dateOfCreation: "19/03/2023",
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

  // To test when the restaurantsList is empty, frontend works as expected

  // yourRestaurantsLists: {
  //   listID: number,
  //   listName: string,
  //   dateOfCreation: string,
  //   restaurants?: {
  //     id: number,
  //     thumbnailURL: string,
  //     restaurantName: string,
  //     ranking: string,
  //     cuisine: string,
  //     address: string,
  //     description: string
  //   }[],
  //   collaborators?: {
  //     id: number,
  //     username: string,
  //     isReadOnly: bool, (READ-ONLY)   > BOTH ARE MUTUALLY EXCLUSIVE
  //     isCollab: bool (READ-WRITE)     > BOTH ARE MUTUALLY EXCLUSIVE
  //   }[]
  // }[] = [];

  // To test when the sharedWithMeRestaurantLists is empty, frontend works as expected
  // sharedWithMeRestaurantLists? : {
  //   sharedListID: number,
  //   sharedListName: string,
  //   sharedListAuthor: string,
  //   myPermissions: string,
  //   restaurants?: {
  //     id: number,
  //     thumbnailURL: string,
  //     restaurantName: string,
  //     ranking: string,
  //     cuisine: string,
  //     address: string,
  //     description: string
  //   }[],
  //   collaborators?: {
  //     id: number,
  //     username: string,
  //     isReadOnly: bool, (READ-ONLY)   > BOTH ARE MUTUALLY EXCLUSIVE
  //     isCollab: bool (READ-WRITE)     > BOTH ARE MUTUALLY EXCLUSIVE
  //   }[],
  // }[] = [];

  sharedWithMeRestaurantLists = [
    {
      sharedListID: 1,
      sharedListName: "A dear friend's list",
      sharedListAuthor: "Kevin",
      myPermissions: "read-only",
      restaurants: [
        {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
      ],
      collaborators: [
        {id: 1, username: "me", permission: "read-only"}
      ]
    },
    {
      sharedListID: 1,
      sharedListName: "A dear friend's list",
      sharedListAuthor: "Kevin",
      myPermissions: "read-only",
      restaurants: [
        {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
        {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
      ],
      collaborators: [
        {id: 1, username: "me", permission: "read-only"}
      ]
    }
  ];

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  //todo: implement expansion of shared list in another modal
  //todo: view in more details (restaurants list and collaborators list)
  //todo: if your permissions are "read-write" then display add button to the list
  goToSharedList(sharedListName: string) {
    console.log("Expand concerned shared list: " + sharedListName);
  }

  async showCreateRestaurantList() {
    const modal = await this.modalController.create({
      component: CreateRestaurantListComponent,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  deleteRestaurantList(restaurantListID: number, restaurantListName: string) {
    //todo: removal of said restaurant list works, remains to implement this on the server/firebase side
    console.log("Your Restaurants Lists -- BEFORE DELETION: \n" + this.yourRestaurantsLists.length);
    console.log("DELETED: " + "\nListName: " + restaurantListName.toString() + "\nListID: " + restaurantListID.toString());
    this.yourRestaurantsLists = this.yourRestaurantsLists.filter(list => list.listID != restaurantListID);
    console.log("Your Restaurants Lists -- AFTER DELETION: \n" + this.yourRestaurantsLists.length);
  }

  async presentRestaurantListDeletionAlert(restaurantListID: number, restaurantListName: string) {
    const alert = await this.alertController.create({
      header: "You're about to delete: " + restaurantListName + "\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + restaurantListName + ". ",
          role: 'confirm',
          handler: () => {
            this.alertHandlerMessage = 'Deletion confirmed!';
            this.deleteRestaurantList(restaurantListID, restaurantListName);
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

  async showModifyRestaurantList(restaurantsListID: number) {
    const matchingRestaurantList = this.yourRestaurantsLists.find(list => list.listID == restaurantsListID);
    const collaborators = matchingRestaurantList?.collaborators?.map((collaborator) => {
      return {
        id: collaborator.id,
        username: collaborator.username,
        isReadOnly: collaborator.isReadOnly,
        isCollab: collaborator.isCollab
      }
    }) ?? [];

    const restaurants = matchingRestaurantList?.restaurants?.map((restaurant) => {
      return {
        id: restaurant.id,
        thumbnailURL: restaurant.thumbnailURL,
        restaurantName: restaurant.restaurantName,
        ranking: restaurant.ranking,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        description: restaurant.description
      }
    }) ?? [];

    const modal = await this.modalController.create({
      component: ModifyRestaurantListComponent,
      componentProps: {
        restaurantListName: matchingRestaurantList?.listName,
        restaurantsList: restaurants,
        restaurantsListCollaborators: collaborators
      }
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

}
