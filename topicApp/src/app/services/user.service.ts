import {inject, Injectable} from '@angular/core';
import {User} from "../models/User";
import {
  addDoc,
  collection,
  collectionData,
  doc,
  where,
  query,
  Firestore,
  getDoc,
  getDocs, DocumentReference, docData
} from '@angular/fire/firestore';
import {Role} from "../models/Enums/Role";
import {AuthenticationMethod} from "../models/Enums/AuthenticationMethod";
import {Topic} from "../models/topic";
import {lastValueFrom, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User =
    { firstname: "Fabien", lastname: "Behra", role: Role.Consumer, id: "", authenticationMethod: AuthenticationMethod.EMAIL, dateOfBirth: new Date("1998-12-05"), email: "behra407@gmail.com", imageUrl: "" };

  private firestore = inject(Firestore)
  constructor() {
  }

  // async getUser(email: string): Observable<User> {
  //   const usersRef = collection(this.firestore, "users");
  //   const q = query(usersRef, where('email', '==', email));
  //   const querySnapshot = await getDocs(q);
  //
  //   if (!querySnapshot.empty && querySnapshot.docs[0].exists()) {
  //     const id = querySnapshot.docs[0].id
  //     const docRef = doc(this.firestore, `users/${id}`) as DocumentReference<User>
  //     const user = await lastValueFrom(of(docData(docRef)))
  //     //voir comment gérer les observable
  //   }
  //   else{
  //
  //   }
  // }

  setUpCurrentUser(connectedUsersEmail: string){

  }

  create(user: User) {
    const collectionRef = collection(this.firestore, "users")
    return addDoc(collectionRef, {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      imageUrl: user.imageUrl,
      dateOfBirth: user.dateOfBirth,
      authenticationMethod: user.authenticationMethod
    });
  }

  get currentUser() : User {
    return this.user;
  }

  isEmailAlreadyExists(email: string) {

  }
}
