import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule, ModalController, NavController, ToastController} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import { NavParams } from '@ionic/angular';
import {RestaurantsList} from "../../models/RestaurantsList";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {Role} from "../../models/Enums/Role";

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
  myPermission: string = "writer";
  restaurantsList: RestaurantsList = {} as RestaurantsList
  modifyRestaurantListForm!: FormGroup;
  isSubmitted = false;
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private restaurantsListService = inject(RestaurantsListService);

  collaborators$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  nonAddedUsers$: Observable<User[]> = EMPTY;

  restaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([]);
  nonAddedRestaurants$: Observable<User[]> = EMPTY;

  restaurantListName: string = "";
  restaurants: Restaurant[] = [];

  /**
   * Collaborators de la liste
   */
  restaurantsListCollaborators: User[] = [
  ];
  myPermissionOnThisList = ""; // can either be 'owner, 'read-write' or 'read-only' -> this can be an enum

  /**
   * Users en base
   */
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

  alertHandlerMessage = '';
  alertRoleMessage = '';

  get isOwner(): boolean {
    return this.myPermission == Role[Role.OWNER].toLowerCase()
  }

  updateRole(user: User) {
    if (user.isCollab) {
      // user.permission = "reader"
      user.isReadOnly = true;
      user.isCollab = false;
      console.log(this.restaurantsListCollaborators);
    } else {
      // user.permission = "writer"
      user.isReadOnly = false;
      user.isCollab = true;
      console.log(this.restaurantsListCollaborators);
    }
  }

  constructor(private navParams: NavParams, private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder,
              private alertController: AlertController) {
    // this.restaurantsListCollaborators = this.navParams.get('restaurantsListCollaborators');
    // this.restaurantsList = this.navParams.get('restaurantsList');
    // this.myPermission = this.navParams.get('myPermission');
    // console.log(this.restaurantsListCollaborators);
    // console.log(this.restaurantsList);
    // console.log(this.myPermissionOnThisList);
  }

  ngOnInit() {
    console.log(this.myPermission);
    this.modifyRestaurantListForm = this.formBuilder.group({
      restaurantslistname: new FormControl(null),
      addedcollaborators: new FormControl(null),
      addedrestaurants: new FormControl(null)
    })
  }
  get errorControl() {
    return this.modifyRestaurantListForm.controls;
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

  async removeCollaborator(user: User) {
    const alert = await this.alertController.create({
      header: "You're about to delete the following user from your list: " + user.username + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + user.username + ". ",
          role: 'confirm',
          handler: () => {
            this.alertHandlerMessage = 'Deletion confirmed!';
            const index = this.restaurantsListCollaborators.findIndex(collaborator => collaborator.username === user.username);
            if (index !== -1) {
              this.restaurantsListCollaborators.splice(index, 1);
            }
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
    const {role} = await alert.onDidDismiss();
    this.alertRoleMessage = `Dismissed with role: ${role}`;
  }

  addRestaurants(selectedRestaurants: string[]) {
    // filter out any restaurants that already exist in the list (to avoid duplicates)
    const newRestaurantsList = selectedRestaurants.filter(newRestaurant =>
      !this.restaurants.find(r => r.restaurantName === newRestaurant));

    // add new restaurants to the list (get all the properties of specific restaurantName)
    newRestaurantsList.forEach((restaurantName: string) => {
      const restaurant = this.existingDatabaseRestaurantsList.find(r => r.restaurantName === restaurantName);

      if (restaurant) {
        const newRestaurant: Restaurant = {
          id: this.restaurants.length + 1,
          thumbnailURL: restaurant.thumbnailURL || '',
          restaurantName: restaurant.restaurantName || '',
          ranking: restaurant.ranking || '',
          cuisine: restaurant.cuisine || '',
          address: restaurant.address || '',
          description: restaurant.description || ''
        }
        this.restaurants.push(newRestaurant);
        console.log(this.restaurantsList);
      } else {
        console.log(`Could not find restaurant with name ${restaurantName}`);
      }
    });
  }

  async removeRestaurant(restaurantName: string) {
    const alert = await this.alertController.create({
      header: "You're about to delete the following restaurant from your list: " + restaurantName + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + restaurantName + ". ",
          role: 'confirm',
          handler: () => {
            this.alertHandlerMessage = 'Deletion confirmed!';
            const index = this.restaurants.findIndex(r => r.restaurantName === restaurantName);
            if (index !== -1) {
              this.restaurants.splice(index, 1);
            }
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
    const {role} = await alert.onDidDismiss();
    this.alertRoleMessage = `Dismissed with role: ${role}`;
  }

  async submitForm() {
    // todo: add server/service side (if failure)
    // -> we will keep the addition of collaborators exclusive to the edition of a list for now (v1.0)
    this.isSubmitted = true;
    console.log("Restaurant list submission.");
    if (!this.modifyRestaurantListForm.valid) {
      const toast = await this.toastController.create({
        message: "Please make sure you provided all required values correctly.",
        duration: 1500,
        position: "bottom",
        color: 'danger'
      });
      await toast.present();
      console.log('Please provide all the required values!')
      return false;
    } else {
      //todo: add server/service side (if successful)
      this.restaurantListName = this.modifyRestaurantListForm.controls['restaurantslistname'].value;
      this.toastController.create({
        message: "Restaurant list modification successful!",
        duration: 1500,
        position: "bottom",
        color: 'success'
      }).then(async (toast) => {
        await toast.present()
        console.log("The restaurant list now contains the following values: " +
          "\nRestaurant list name: " + this.restaurantListName +
          "\nRestaurants inside: " + this.restaurants.map(m => m.restaurantName).join(", ") +
          "\nCollaborators on the list and their permissions: " + "\n" + this.restaurantsListCollaborators.map(m => m.username).join(", "));
      });
      this.dismissModal(); // dismiss modal upon creation of list
      return true;
    }
  }
}
