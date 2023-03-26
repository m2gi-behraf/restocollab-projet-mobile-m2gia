import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertController, IonicModule, ModalController, ToastController} from "@ionic/angular";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import { NavParams } from '@ionic/angular';
import {RestaurantsList} from "../../models/RestaurantsList";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {BehaviorSubject, EMPTY, firstValueFrom, Observable} from "rxjs";
import {Role} from "../../models/Enums/Role";
import {UserService} from "../../services/user.service";
import {User} from "../../models/User";
import {Restaurant} from "../../models/Restaurant";
import {RestaurantService} from "../../services/restaurant.service";
import {restaurant} from "ionicons/icons";

// interface User {
//   id: number,
//   username: string,
//   isReadOnly: boolean,
//   isCollab: boolean
// }

// interface Restaurant {
//   id: number,
//   thumbnailURL: string,
//   restaurantName: string,
//   ranking: string,
//   cuisine: string,
//   address:  string,
//   description: string,
// }

@Component({
  selector: 'app-modify-restaurant-list',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf, FormsModule, AsyncPipe],
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
  private alertController = inject(AlertController);
  private restaurantsListService = inject(RestaurantsListService);
  private restaurantService = inject(RestaurantService);
  private userService = inject(UserService);

  //Collaborators
  /**
   * Array of the current roles, register all the changes to submit the hole map to firebase
   * @private
   */
  private arrayCollabRoles: [string, string][] = []
  pickerSelectedUsersIds: string[] = []
  nonCollaborators$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  collaborators: User[] = [];

  //Restaurants
  addedRestaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([]);
  allRestaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([]);
  nonAddedRestaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([]);

  restaurantListName: string = "";
  pickerSelectedRestaurantsIds: string[] = []
  restaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([]);
  deletedRestaurantsIds: string[] = [];

  /**
   * Collaborators de la liste
   */
  restaurantsListCollaborators: User[] = [ ];
  myPermissionOnThisList = ""; // can either be 'owner, 'read-write' or 'read-only' -> this can be an enum

  existingDatabaseRestaurantsList = [
    {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 3, thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
  ]

  alertRoleMessage = '';


  constructor(private navParams: NavParams, private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder) { }

  async ngOnInit() {
    // TODO
    // - allRestaurants$ -> BehaviorSubject de tous les restaurants de la base
    // - addedRestaurants$ -> BehaviorSubject de tous les restaurants ajoutés
    // - pickerRestaurants -> array de restaurants bindé avec le picker
    // Initialisation
    // - Appel de RestaurantsOfThisLists et AllRestaurants -> et init des variables
    this.modifyRestaurantListForm = this.formBuilder.group({
      restaurantslistname: new FormControl(null),
      addedcollaborators: new FormControl(null),
      addedrestaurants: new FormControl(null)
    })

    this.nonAddedRestaurants$.subscribe((restaurants) => {
      console.log("Non Added Restaurants changed -> ", restaurants)
    });

    this.restaurants$.subscribe((restaurants) => {
      console.log("List of Restaurants changed -> ", restaurants)
    });

    this.addedRestaurants$.subscribe((restaurants) => {
      console.log("Added Restaurants changed -> ", restaurants)
      let remoteAddedIds = restaurants.map((r) => r.id)

      this.restaurants$.next(restaurants
        .filter((r) => !this.deletedRestaurantsIds.includes(r.id))
        .concat(this.restaurants$.getValue().filter((r) => !remoteAddedIds.includes(r.id))))
    });

    this.restaurantsListService.findAllRestaurants(this.restaurantsList.id)
      .subscribe((restaurants) => {
        this.addedRestaurants$.next(restaurants)
        this.nonAddedRestaurants$.next(this.allRestaurants$.getValue().filter((r) => !this.addedRestaurants$.getValue().map(x => x.id).includes(r.id)))
      });

    this.restaurantService.findAll()
      .subscribe((restaurants) => {
        this.allRestaurants$.next(restaurants)
        this.nonAddedRestaurants$.next(this.allRestaurants$.getValue().filter((r) => !this.addedRestaurants$.getValue().map(x => x.id).includes(r.id)))
      });

    this.restaurantsListService.findOne(this.restaurantsList.id).subscribe((list) => this.restaurantsList = list)

    //get once all collaborators, because only one person can modify them, no observable needed
    this.arrayCollabRoles = Object.entries(this.restaurantsList.roles);
    this.collaborators = await firstValueFrom(this.userService.findAllById(Object.keys(this.restaurantsList.roles)));

    //Add observable on all database users, if change -> refresh the picker list
    this.userService.findAll().subscribe((users )=> {
      let collabIds = this.collaborators.map(user => user.id);
      this.nonCollaborators$.next(users.filter((user) => collabIds.indexOf(user.id) == -1 ));
    });
  }
  get errorControl() {
    return this.modifyRestaurantListForm.controls;
  }

  get isCurrentUserOwner(): boolean {
    return this.myPermission == Role[Role.OWNER].toLowerCase()
  }

  dismissModal() {
    this.modalController.dismiss(this.restaurantsList);
  }

  /**
   * Add selected collaborators to the current list of collaborators
   */
  addCollaborators() {
    if (this.pickerSelectedUsersIds.length == 0)
      return;

    let selectedUsers = this.nonCollaborators$.getValue().filter((user) => this.pickerSelectedUsersIds.indexOf(user.id) > -1)
    selectedUsers.forEach((user) => this.arrayCollabRoles.push([user.id, Role[Role.READER].toLowerCase()]));

    this.collaborators = this.collaborators.concat(selectedUsers);
    this.nonCollaborators$.next(this.nonCollaborators$.getValue().filter((user) => this.collaborators.indexOf(user) == -1))
    this.pickerSelectedUsersIds= [];
  }

  /**
   * Remove the selected user from the collaborators list
   * @param user
   */
  async removeCollaborator(user: User) {
    const alert = await this.alertController.create({
      header: "You're about to delete the following user from your list: " + user.username + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + user.username + ". ",
          role: 'confirm'
        },
        {
          text: "Abort",
          role: 'cancel'
        },
      ],
    });
    await alert.present();
    const {role} = await alert.onDidDismiss();

    if (role == 'confirm') {
      this.collaborators.splice(this.collaborators.indexOf(user),1);
      let tuple = this.arrayCollabRoles.filter((tuple) => tuple[0] === user.id);
      this.arrayCollabRoles.splice(this.arrayCollabRoles.indexOf(tuple[0]), 1);
      this.nonCollaborators$.next(this.nonCollaborators$.getValue().concat(user))

      console.log("Collaborator deleted, remaining collaborators -> ", this.collaborators)
    }
  }

  /**
   * Return the permission of the given user on the current list
   * @param user user to get permissions of
   */
  getPermission(user: User) : string {
    let tuple = this.arrayCollabRoles.filter((tuple) => tuple[0] === user.id);
    return tuple[0][1];
  }

  /**
   * Return the permission label (collaborator for writer) of the given user on the current list
   * @param user user to get permissions of
   */
  getPermissionLabel(user: User) : string {
    let tuple = this.arrayCollabRoles.filter((tuple) => tuple[0] === user.id);
    return this.restaurantsListService.getPermissionLabel(tuple[0][1]);
  }

  /**
   * Indicate if the given user have the role writer or greater
   * @param user
   */
  isWriter(user: User) : boolean {
    let permission = this.getPermission(user)
    return permission == Role[Role.OWNER].toLowerCase() || permission == Role[Role.WRITER].toLowerCase()
  }

  /**
   * Indicate if the given user have the role owner
   * @param user
   */
  isOwner(user: User): boolean {
    let permission = this.restaurantsListService.getPermission(this.restaurantsList, user.id)
    return permission == Role[Role.OWNER].toLowerCase()
  }

  /**
   * Change the role of the given user to writer or reader depends on its role
   * @param user user
   */
  updateRole(user: User) {
    let tupleUserRole = this.arrayCollabRoles.filter((tuple) => tuple[0] === user.id);
    let index = this.arrayCollabRoles.indexOf(tupleUserRole[0]);

    if (index > -1) {
      let oldRole = this.arrayCollabRoles[index][1]
      this.arrayCollabRoles[index][1] = oldRole == Role[Role.READER].toLowerCase()
        ? Role[Role.WRITER].toLowerCase() : Role[Role.READER].toLowerCase();
    }
    console.log("Roles updated -> ", this.arrayCollabRoles);
  }

  /**
   * Add selected restaurants to the current list of restaurants
   */
  addRestaurants() {
    if (this.pickerSelectedRestaurantsIds.length == 0)
      return;

    let selectedRestaurants = this.nonAddedRestaurants$.getValue().filter((r) => this.pickerSelectedRestaurantsIds.includes(r.id))
    this.restaurants$.next(this.restaurants$.getValue().concat(selectedRestaurants));

    let nonAddedRs = this.nonAddedRestaurants$.getValue().filter((r) => !this.restaurants$.getValue().map((x) => x.id).includes(r.id))
    this.nonAddedRestaurants$.next(nonAddedRs)
    this.pickerSelectedRestaurantsIds = [];
  }

  async removeRestaurant(restaurantName: string) {
    const alert = await this.alertController.create({
      header: "You're about to delete the following restaurant from your list: " + restaurantName + ".\nThis action is irreversible, are you sure you want to proceed?",
      buttons: [
        {
          text: "Yes, I'm sure. \nDelete " + restaurantName + ". ",
          role: 'confirm',
          // handler: () => {
          //   const index = this.restaurants.findIndex(r => r.name === restaurantName);
          //   if (index !== -1) {
          //     this.restaurants.splice(index, 1);
          //   }
          // },
        },
        {
          text: "Abort",
          role: 'cancel',
          handler: () => {
          },
        },
      ],
    });
    await alert.present();
    const {role} = await alert.onDidDismiss();
    this.alertRoleMessage = `Dismissed with role: ${role}`;
  }

  async submitForm() {
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

      //transform array into map
      let mapRole = {};
      this.arrayCollabRoles.forEach((tuple) => {
        // @ts-ignore
        mapRole[tuple[0] as string] = tuple[1]
      });

      // @ts-ignore
      this.restaurantsList.roles = mapRole;
      this.restaurantsListService.update(this.restaurantsList);
      this.toastController.create({
        message: "Restaurant list modification successful!",
        duration: 1500,
        position: "bottom",
        color: 'success'
      }).then(async (toast) => {
        await toast.present()
      });
      this.dismissModal(); // dismiss modal upon creation of list
      return true;
    }
  }
}
