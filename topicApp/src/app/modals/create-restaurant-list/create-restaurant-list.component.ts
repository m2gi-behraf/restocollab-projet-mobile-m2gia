import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule, ModalController, ToastController} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-create-restaurant-list',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, NgIf, NgForOf],
  templateUrl: './create-restaurant-list.component.html',
  styleUrls: ['./create-restaurant-list.component.scss'],
})
export class CreateRestaurantListComponent implements OnInit {
  restaurantListCreationForm!: FormGroup;
  isSubmitted = false;
  private toastController = inject(ToastController);


  private modalController = inject(ModalController);

  // todo: this will need to be removed and replaced by the restaurant service that fetches all existing restaurants in the db
  existingRestaurantsList = [
    {id: 1, thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 2, thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
    {id: 3, thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble", description: "The restaurant offers a welcoming atmosphere and a diverse menu with fresh ingredients. The staff is friendly and attentive, and they can help you choose from classic or adventurous dishes. Come and enjoy a delicious meal with friends or family!"},
  ]

  restaurantListName = "";
  selectedRestaurantsList = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
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
    console.log('ionChange fired with value: ' + e.detail.value);
    this.selectedRestaurantsList = e.detail.value;
    console.log("The selected restaurants are: " + this.selectedRestaurantsList);
  }

  handleCancel() {
    console.log("Dismissed/cancelled.")
  }

  async submitForm() {
    //todo: add server/service side
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
    } else {
      //todo: add server/service side
      this.restaurantListName = this.restaurantListCreationForm.controls['listname'].value;
      console.log("The restaurant list name is: " + this.restaurantListName
        + "\nSelected restaurants are: " + this.selectedRestaurantsList);
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
