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

  findOne(id: String): Observable<RestaurantsList> {
    const documentRef = doc(this.firestore, `restaurants-list/${id}`) as DocumentReference<RestaurantsList>;
    return docData<RestaurantsList>(documentRef, {idField: 'id'});
  }

  findAllRestaurants(idRestaurantsList: String): Observable<Restaurant[]> {
    console.log(idRestaurantsList);
    const collectionRef = collection(this.firestore, `restaurants-list/${idRestaurantsList}/restaurants`) as CollectionReference<Restaurant>;
    return collectionData<any>(collectionRef, {idField: 'id'})
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
