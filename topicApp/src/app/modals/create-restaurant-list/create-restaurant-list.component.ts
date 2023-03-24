import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {BehaviorSubject, EMPTY, firstValueFrom, Observable} from "rxjs";
import {RestaurantsList} from "../../models/RestaurantsList";
import {Restaurant} from "../../models/Restaurant";
import {RestaurantsListService} from "../../services/restaurantsList.service";
import {RestaurantService} from "../../services/restaurant.service";
import {restaurant} from "ionicons/icons";
import {UserService} from "../../services/user.service";
import {Role} from "../../models/Enums/Role";

@Component({
  selector: 'app-create-restaurant-list',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './create-restaurant-list.component.html',
  styleUrls: ['./create-restaurant-list.component.scss'],
})
export class CreateRestaurantListComponent implements OnInit {
  restaurantListCreationForm!: FormGroup;
  isSubmitted = false;

  pickerRestaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([])
  restaurantsList: RestaurantsList = {} as RestaurantsList;
  restaurants$: Observable<Restaurant[]> = EMPTY;
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);
  private restaurantsListService = inject(RestaurantsListService)
  private restaurantService = inject(RestaurantService)
  private userService = inject(UserService)
  // todo: this will need to be removed and replaced by the restaurant service that fetches all existing restaurants in the db
  existingRestaurantsList = [
    {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 3, thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
  ]

  selectedRestaurantsList = [];

  constructor(private formBuilder: FormBuilder) { }

  async ngOnInit() {
    this.restaurants$ = this.restaurantService.findAll();
    this.restaurantListCreationForm = this.formBuilder.group({
      listname: ['', [Validators.required]],
      restaurants: ['', [Validators.required]]
    })
  }

  get errorControl() {
    return this.restaurantListCreationForm.controls;
  }


  dismissModal() {
    this.modalController.dismiss();
  }

  handleRestaurantSelectionChange(e: any) {
    this.selectedRestaurantsList = e.detail.value;
  }

  private async createRestaurantsList(name: string, ids: string[]){
    let restaurantsList: RestaurantsList = {
      name: name,
      authorUsername: this.userService.currentUser.username,
      dateOfCreation: new Date(),
      description: "",
      id: "",
      roles: {} as Map<string,string>,
      restaurants: this.restaurantService.findAllById(ids)
    }

    console.log(restaurantsList);
    await this.restaurantsListService.create(restaurantsList)
  }

  async submitForm() {
    //todo: add server/service side
    // -> we will keep the addition of collaborators exclusive to the edition of a list for now (v1.0)
    this.isSubmitted = true;
    console.log("Restaurant list submission.");
    if (!this.restaurantListCreationForm.valid) {
      const toast = await this.toastController.create({
        message: "Please make sure you provided all required values correctly.",
        duration: 1500,
        position: "bottom",
        color: 'danger'
      });
      await toast.present();
      console.log('Please provide all the required values!')
      return false;
    }
    else
    {
      let name = this.restaurantListCreationForm.controls['listname'].value;
      let restaurants = this.restaurantListCreationForm.controls['restaurants'].value;
      await this.createRestaurantsList(name, restaurants)

      this.toastController.create({
        message: "Restaurant list creation successful!",
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
