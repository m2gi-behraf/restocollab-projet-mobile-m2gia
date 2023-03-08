import {inject, Injectable} from '@angular/core';
import { Firestore, collection, collectionData, DocumentData, doc, addDoc, deleteDoc, docData, DocumentReference, CollectionReference } from '@angular/fire/firestore';
import {Restaurant} from "../models/Restaurant";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private firestore = inject(Firestore)
  constructor() { }

  /**
   * Try to find a restaurant inside firestore collection matching given id
   * @param restaurantId Id of restaurant
   */
  findOne(restaurantId: string): Observable<Restaurant | null>{
    const documentRef = doc(this.firestore, `restaurants/${restaurantId}`) as DocumentReference<Restaurant>;
    return docData<Restaurant>(documentRef)
  }

  /**
   * Return all restaurants
   */
  findAll(): Observable<Restaurant[] | null> {
    const collectionRef = collection(this.firestore, `restaurants`) as CollectionReference<Restaurant>;
    return collectionData(collectionRef);
  }

  create(restaurant: Restaurant): void {
    const collectionRef = collection(this.firestore, `restaurants`);
    addDoc(collectionRef, restaurant);
  }
}
