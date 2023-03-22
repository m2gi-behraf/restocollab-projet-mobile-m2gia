import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule, ModalController, NavController, ToastController} from "@ionic/angular";
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
  userLoggedInIsOwner = true;
  modifyRestaurantListForm!: FormGroup;
  isSubmitted = false;
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);

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

  alertHandlerMessage = '';
  alertRoleMessage = '';

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

  constructor(private navParams: NavParams, private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder,
              private alertController: AlertController) {
    this.restaurantsListCollaborators = this.navParams.get('restaurantsListCollaborators');
    this.restaurantsList = this.navParams.get('restaurantsList');
    console.log(this.restaurantsListCollaborators);
    console.log(this.restaurantsList);
  }

  ngOnInit() {
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

  async removeRestaurant(restaurantName: string) {
    const alert = await this.alertController.create({
      header: "You're about to delete the following restaurant from your list: " + restaurantName + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + restaurantName + ". ",
          role: 'confirm',
          handler: () => {
            this.alertHandlerMessage = 'Deletion confirmed!';
            const index = this.restaurantsList.findIndex(r => r.restaurantName === restaurantName);
            if (index !== -1) {
              this.restaurantsList.splice(index, 1);
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
          "\nRestaurants inside: " + this.restaurantsList.map(m => m.restaurantName).join(", ") +
          "\nCollaborators on the list and their permissions: " + "\n" + this.restaurantsListCollaborators.map(m => m.username).join(", "));
      });
      this.dismissModal(); // dismiss modal upon creation of list
      return true;
    }
  }

  async deleteRestaurantList(listName: string) {
    const alert = await this.alertController.create({
      header: "You're about to delete the list: " + listName + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + listName + ". ",
          role: 'confirm',
          handler: () => {
            // todo: replace existingDatabaseRestaurantsList with list of restaurants that is displayed in the my-collaborations
            // (user's list of restaurants)
            //todo:               replace here
            const index = this.existingDatabaseRestaurantsList.findIndex(l => listName === listName);
            if (index !== -1) {
              //todo: replace here
              this.existingDatabaseRestaurantsList.splice(index, 1);
            }
            this.alertHandlerMessage = 'Deletion confirmed!';
            console.log("UPDATED LIST OF RESTAURANTS");
            this.dismissModal();
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
}
