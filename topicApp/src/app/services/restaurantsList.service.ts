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
  query, where, limit, setDoc, updateDoc
} from '@angular/fire/firestore';
import {firstValueFrom, Observable, of} from "rxjs";
import {RestaurantsList} from "../models/RestaurantsList";
import {Restaurant} from "../models/Restaurant";
import {UserService} from "./user.service";
import {Role} from "../models/Enums/Role";
import {User} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsListService {
  private readonly ROOT = "restaurants-list"
  private readonly mapRoleLabel = new Map<string, string>([
    ["owner", "owner"],
    ["writer", "collaborator"],
    ["reader", "reader"],
  ]);

  private firestore = inject(Firestore)
  private userService = inject(UserService)

  constructor() { }

  /**
   * Get all RestaurantsLists where the current user is Owner, Reader, or Writer
   */
  findMine(): Observable<RestaurantsList[]> {
    const collectionRef = collection(this.firestore, `${this.ROOT}`) as CollectionReference<RestaurantsList>;
    const allowedRoles = [Role[Role.OWNER].toLowerCase()]

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

  /**
   * delete a restaurant from a list
   * @param idRestaurantsList list
   * @param restaurant restaurant to delete
   */
  async deleteRestaurant(idRestaurantsList: string, restaurant: Restaurant): Promise<void> {
      const documentRef = doc(this.firestore, `${this.ROOT}/${idRestaurantsList}/restaurants/${restaurant.id}`) as DocumentReference<Restaurant>
    await deleteDoc(documentRef);
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

  /**
   * Delete the restaurantsLists and all it's restaurants
   * @param restaurantsList list to delete
   */
  async delete(restaurantsList: RestaurantsList): Promise<void> {
    const documentRef = doc(this.firestore, `${this.ROOT}/${restaurantsList.id}`) as DocumentReference<RestaurantsList>
    const collectionRef = collection(this.firestore, `${this.ROOT}/${restaurantsList.id}/restaurants`) as CollectionReference<Restaurant>

    //Suppression des restaurants
    let restaurants = await firstValueFrom(collectionData(collectionRef, {idField: 'id'}))
    restaurants.forEach(async (restaurant) => {
      await this.deleteRestaurant(restaurantsList.id, restaurant);
    });

    await deleteDoc(documentRef)
  }

  update(restaurantsList: RestaurantsList) {
    console.log("update", restaurantsList)
    let keys = Object.keys(restaurantsList.roles);
    let values = Object.values(restaurantsList.roles);
    let mapRole = {};
    keys.forEach((id, index) => {
      // @ts-ignore
      mapRole[id] = values[index]
    });
    console.log(mapRole);

    const documentRef = doc(this.firestore, `${this.ROOT}/${restaurantsList.id}`)
    updateDoc(documentRef, {
      name:restaurantsList.name,
      roles: mapRole
    })
  }

  /**
   * Return the permission of the user on the given list
   * @param list list
   */
  getPermission(list: RestaurantsList, userId: string) : string {
    let keys = Object.keys(list.roles);
    let values = Object.values(list.roles);

    let role: string = values[keys.indexOf(userId)]
    let mappedRole = this.mapRoleLabel.get(role) ?? "undefined";
    return mappedRole;
  }

  getPermissionLabel(role: string) : string {
    return this.mapRoleLabel.get(role) ?? 'undefined'
  }
}
