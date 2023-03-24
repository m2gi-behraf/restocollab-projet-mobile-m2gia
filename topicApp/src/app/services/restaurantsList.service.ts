import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  docData,
  DocumentReference,
  CollectionReference,
  query, where, limit, setDoc
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
    const collectionRef = collection(this.firestore, `restaurants-list/${idRestaurantsList}/restaurants`) as CollectionReference<Restaurant>;
    return collectionData<any>(collectionRef, {idField: 'id'})
  }

  /**
   * Add a restaurant to list
   * @param idRestaurantsList
   * @param restaurant
   */
  async addRestaurant(idRestaurantsList: string, restaurant: Restaurant): Promise<void> {
    await setDoc(doc(this.firestore, `${this.ROOT}/${idRestaurantsList}/restaurants`, `${restaurant.id}`), restaurant)
  }

  deleteRestaurant(idRestaurantsList: string, restaurant: Restaurant): void {
    //TODO Fabien -> Delete Restaurant
  }

  /**
   * Create a new RestaurantsList and add all selected restaurants into it
   * @param restaurantsList
   */
  async create(restaurantsList: RestaurantsList): Promise<void> {
    const collectionRef = collection(this.firestore, `${this.ROOT}`);
    const userId = this.userService.currentUser.id;
    let docRef = await addDoc(collectionRef, {
      name:restaurantsList.name,
      description: restaurantsList.description,
      authorUserName: restaurantsList.authorUsername,
      dateOfCreation: restaurantsList.dateOfCreation,
      roles: { [userId]: Role[Role.OWNER].toLowerCase() }
    });

    //add restaurants
    let doc = await firstValueFrom(docData(docRef, {idField:'id'})) as RestaurantsList
    restaurantsList.restaurants.forEach(async (restaurant) => {
      await this.addRestaurant(doc.id as string, restaurant);
    })
  }

  delete(restaurantsList: RestaurantsList): void {
    const documentRef = doc(this.firestore, `${this.ROOT}/${restaurantsList.id}`) as DocumentReference<RestaurantsList>
    deleteDoc(documentRef)
  }
}
