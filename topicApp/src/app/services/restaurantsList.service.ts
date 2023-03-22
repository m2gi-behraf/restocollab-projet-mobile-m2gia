import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  DocumentData,
  doc,
  addDoc,
  deleteDoc,
  docData,
  DocumentReference,
  CollectionReference,
  query, where, getDocs, limit
} from '@angular/fire/firestore';
import {firstValueFrom, Observable, of} from "rxjs";
import {RestaurantsList} from "../models/RestaurantsList";
import {Restaurant} from "../models/Restaurant";
import {UserService} from "./user.service";
import {User} from "../models/User";
import {Role} from "../models/Enums/Role";
import {user} from "@angular/fire/auth";

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

  /**
   * Get all RestaurantsLists where the current user is Owner, Reader, or Writer
   */
  findMyRestaurantsLists(): Observable<RestaurantsList[]> {
    const collectionRef = collection(this.firestore, `restaurants-list`) as CollectionReference<RestaurantsList>;
    const allowedRoles = [Role[Role.OWNER].toLowerCase(), Role[Role.WRITER].toLowerCase(), Role[Role.READER].toLowerCase()]

    const q = query(collectionRef, where(`roles.${this.userService.currentUser.id}`, 'in', allowedRoles), limit(50));
    return collectionData(q, { idField: 'id' })
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
