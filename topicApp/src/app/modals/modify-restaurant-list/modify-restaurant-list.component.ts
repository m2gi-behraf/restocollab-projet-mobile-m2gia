import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import { NavParams } from '@ionic/angular';

interface User {
  id: number,
  username: string,
  isReadOnly: boolean,
  isCollab: boolean
}

interface Restaurant {
  id: number,
  thumbnailURL: string,
  restaurantName: string,
  ranking: string,
  cuisine: string,
  address:  string,
  description: string,
}

@Component({
  selector: 'app-modify-restaurant-list',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf, FormsModule],
  templateUrl: './modify-restaurant-list.component.html',
  styleUrls: ['./modify-restaurant-list.component.scss'],
})

export class ModifyRestaurantListComponent implements OnInit {
  isModalOpen = false;
  private modalController = inject(ModalController);
  restaurantListName: string = "";
  restaurantsList: Restaurant[] = [];
  restaurantsListCollaborators: User[] = [
  ];

  existingDatabaseUsers: User[] = [
    {id: 1, username: 'John', isReadOnly: false, isCollab: true},
    {id: 2, username: 'Mary', isReadOnly: true, isCollab: false},
    {id: 3, username: 'Tom', isReadOnly: false, isCollab: false}
  ];

  existingDatabaseRestaurantsList = [
    {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 3, thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
  ]

  updateRole(user: User) {
    if (user.isCollab) {
      user.isReadOnly = true;
      user.isCollab = false;
      console.log(this.restaurantsListCollaborators);

    } else {
      user.isReadOnly = false;
      user.isCollab = true;
      console.log(this.restaurantsListCollaborators);

    }
  }

  constructor(private navParams: NavParams, private cdRef: ChangeDetectorRef) {
    this.restaurantsListCollaborators = this.navParams.get('restaurantsListCollaborators');
    this.restaurantsList = this.navParams.get('restaurantsList');
    console.log(this.restaurantsListCollaborators);
    console.log(this.restaurantsList);
  }

  ngOnInit() {
    this.isModalOpen = true;
    this.cdRef.detectChanges(); // manually trigger change detection
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addCollaborators(selectedUsernames: string[]) {
    // filter out any usernames that already exist in the list (to avoid duplicates)
    const newCollaborators = selectedUsernames.filter(username =>
      !this.restaurantsListCollaborators.find(c => c.username === username));

    // add new collaborators to the list
    newCollaborators.forEach(username => {
      const newUser: User = {
        id: this.restaurantsListCollaborators.length + 1,
        username: username,
        isReadOnly: true,
        isCollab: false
      };
      this.restaurantsListCollaborators.push(newUser);
    });
  }

  removeCollaborator(user: User) {
    const index = this.restaurantsListCollaborators.findIndex(collaborator => collaborator.username === user.username);
    if (index !== -1) {
      this.restaurantsListCollaborators.splice(index, 1);
    }
  }

  addRestaurants(selectedRestaurants: string[]) {
    // filter out any restaurants that already exist in the list (to avoid duplicates)
    const newRestaurantsList = selectedRestaurants.filter(newRestaurant =>
      !this.restaurantsList.find(r => r.restaurantName === newRestaurant));

    // add new restaurants to the list (get all the properties of specific restaurantName)
    newRestaurantsList.forEach((restaurantName: string) => {
      const restaurant = this.existingDatabaseRestaurantsList.find(r => r.restaurantName === restaurantName);

      if (restaurant) {
        const newRestaurant: Restaurant = {
          id: this.restaurantsList.length + 1,
          thumbnailURL: restaurant.thumbnailURL || '',
          restaurantName: restaurant.restaurantName || '',
          ranking: restaurant.ranking || '',
          cuisine: restaurant.cuisine || '',
          address: restaurant.address || '',
          description: restaurant.description || ''
        }
        this.restaurantsList.push(newRestaurant);
        console.log(this.restaurantsList);
      } else {
        console.log(`Could not find restaurant with name ${restaurantName}`);
      }
    });
  }

  removeRestaurant(restaurantName: string) {
    const index = this.restaurantsList.findIndex(r => r.restaurantName === restaurantName);
    if (index !== -1) {
      this.restaurantsList.splice(index, 1);
    }
  }

}
