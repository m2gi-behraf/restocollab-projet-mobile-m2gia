import {inject, Injectable} from '@angular/core';
import { Firestore, collection, collectionData, DocumentData, doc, addDoc, deleteDoc, docData, DocumentReference, CollectionReference } from '@angular/fire/firestore';
import {Observable} from "rxjs";
import {RestaurantsList} from "../models/RestaurantsList";
import {Restaurant} from "../models/Restaurant";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsListService {

  private firestore = inject(Firestore)
  private userService = inject(UserService)

  constructor() { }

  findOne(id: String): Observable<RestaurantsList | null> {
    const documentRef = doc(this.firestore, `guides/${id}`) as DocumentReference<RestaurantsList>;
    return docData<RestaurantsList>(documentRef);
  }

  findAllRestaurants(idRestaurantsList: String): Observable<Restaurant[] | null> {
    const collectionRef = collection(this.firestore, `guides/${idRestaurantsList}/restaurants`) as CollectionReference<Restaurant>;
    return collectionData<any>(collectionRef)
  }

  addRestaurant(idRestaurantsList: string, restaurant: Restaurant): void {
    //TODO Fabien -> RestaurantsListService/AddRestaurant
    //vérifier la non existence du restaurant
    //vérfier les droits d'écritures
  }

  deleteRestaurant(idRestaurantsList: string, restaurant: Restaurant): void {
    //TODO Fabien -> Delete Restaurant
  }

  create(restaurantsList: RestaurantsList): void {
    const collectionRef = collection(this.firestore, `guides`);
    addDoc(collectionRef, { name: restaurantsList.name, description: restaurantsList.description, writers: Array.of(this.userService.currentUser.id) });
  }

  delete(restaurantsList: RestaurantsList): void {
    const documentRef = doc(this.firestore, `guides/${restaurantsList.id}`) as DocumentReference<RestaurantsList>
    deleteDoc(documentRef)
  }
}
