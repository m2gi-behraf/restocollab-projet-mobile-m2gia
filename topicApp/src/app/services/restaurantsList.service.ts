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
import {Role} from "../models/Enums/Role";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsListService {
  private readonly ROOT = "restaurants-list"

  private firestore = inject(Firestore)
  private userService = inject(UserService)

  constructor() { }

  /**
   * Get all RestaurantsLists where the current user is Owner, Reader, or Writer
   */
  findMine(): Observable<RestaurantsList[]> {
    const collectionRef = collection(this.firestore, `${this.ROOT}`) as CollectionReference<RestaurantsList>;
    const allowedRoles = [Role[Role.OWNER].toLowerCase()]

    console.log("User =>", this.userService.currentUser)
    const q = query(collectionRef, where(`roles.${this.userService.currentUser.id}`, 'in', allowedRoles), limit(50));
    return collectionData(q, { idField: 'id' })
  }

  /**
   * Get all RestaurantsLists where the current user is Owner, Reader, or Writer
   */
  findSharedWithMe(): Observable<RestaurantsList[]> {
    const collectionRef = collection(this.firestore, `${this.ROOT}`) as CollectionReference<RestaurantsList>;
    const allowedRoles = [Role[Role.WRITER].toLowerCase(), Role[Role.READER].toLowerCase()]

    const q = query(collectionRef, where(`roles.${this.userService.currentUser.id}`, 'in', allowedRoles), limit(50));
    return collectionData(q, {idField: 'id'})
  }

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
    const collectionRef = collection(this.firestore, `${this.ROOT}`);
    const map = new Map([
      [this.userService.currentUser.id, Role[Role.OWNER].toLowerCase()]
    ])
    addDoc(collectionRef, { name: restaurantsList.name, description: restaurantsList.description, roles: map });
  }

  delete(restaurantsList: RestaurantsList): void {
    const documentRef = doc(this.firestore, `${this.ROOT}/${restaurantsList.id}`) as DocumentReference<RestaurantsList>
    deleteDoc(documentRef)
  }
}
