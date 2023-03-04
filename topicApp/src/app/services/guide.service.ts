import {inject, Injectable} from '@angular/core';
import { Firestore, collection, collectionData, DocumentData, doc, addDoc, deleteDoc, docData, DocumentReference, CollectionReference } from '@angular/fire/firestore';
import {Observable} from "rxjs";
import {Guide} from "../models/Guide";
import {Restaurant} from "../models/Restaurant";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  private firestore = inject(Firestore)
  private userService = inject(UserService)

  constructor() { }

  findOne(id: String): Observable<Guide | null> {
    const documentRef = doc(this.firestore, `guides/${id}`) as DocumentReference<Guide>;
    return docData<Guide>(documentRef);
  }

  findAllRestaurants(idGuide: String): Observable<Restaurant[] | null> {
    const collectionRef = collection(this.firestore, `guides/${idGuide}/restaurants`) as CollectionReference<Restaurant>;
    return collectionData<any>(collectionRef)
  }

  addRestaurant(idGuide: string, restaurant: Restaurant): void {
    //TODO Fabien -> GuideService/AddRestaurant
    //vérifier la non existence du restaurant
    //vérfier les droits d'écritures
  }

  deleteRestaurant(idGuide: string, restaurant: Restaurant): void {
    //TODO Fabien -> Delete Restaurant
  }

  create(guide: Guide): void {
    const collectionRef = collection(this.firestore, `guides`);
    addDoc(collectionRef, { name: guide.name, description: guide.description, writers: Array.of(this.userService.currentUser.id) });
  }

  delete(guide: Guide): void {
    const documentRef = doc(this.firestore, `guides/${guide.id}`) as DocumentReference<Guide>
    deleteDoc(documentRef)
  }
}
