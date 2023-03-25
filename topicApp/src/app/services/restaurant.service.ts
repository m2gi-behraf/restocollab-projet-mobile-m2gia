import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  docData,
  DocumentReference,
  CollectionReference,
} from '@angular/fire/firestore';
import {Restaurant} from "../models/Restaurant";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private firestore = inject(Firestore)
  public restaurants$: BehaviorSubject<Restaurant[]> = new BehaviorSubject<Restaurant[]>([] as Restaurant[]);
  constructor() { }

  /**
   * Try to find a restaurant inside firestore collection matching given id
   * @param restaurantId Id of restaurant
   */
  findOne(restaurantId: string): Observable<Restaurant | null>{
    const documentRef = doc(this.firestore, `restaurants/${restaurantId}`) as DocumentReference<Restaurant>;
    return docData<Restaurant>(documentRef, {idField: 'id'})
  }

  /**
   * Return all restaurants matching given ids
   */
  findAllById(ids: string[]): Restaurant[] {
    let restaurants: Restaurant[] = new Array<Restaurant>()
    ids.forEach(async (id) => {
      let restaurant = await firstValueFrom(this.findOne(id)) as Restaurant
      restaurants.push(restaurant);
    });
    return restaurants;
  }

  /**
   * Return all restaurants
   */
  findAll(): Observable<Restaurant[]> {
    const collectionRef = collection(this.firestore, `restaurants`) as CollectionReference<Restaurant>;
    return collectionData<any>(collectionRef, { idField: 'id' });
  }

  create(restaurant: Restaurant): void {
    const collectionRef = collection(this.firestore, `restaurants`);
    addDoc(collectionRef, restaurant);
  }
}
