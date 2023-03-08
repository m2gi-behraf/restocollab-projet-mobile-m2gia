import {inject, Injectable} from '@angular/core';
import {User} from "../models/User";
import {addDoc, collection, collectionData, doc, Firestore} from '@angular/fire/firestore';
import {Role} from "../models/Enums/Role";
import {AuthenticationMethod} from "../models/Enums/AuthenticationMethod";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User =
    { firstname: "Fabien", lastname: "Behra", role: Role.Consumer, id: "", authenticationMethod: AuthenticationMethod.EMAIL, dateOfBirth: new Date("1998-12-05"), email: "behra407@gmail.com" };

  private firestore = inject(Firestore)
  constructor() {
  }

  setUpCurrentUser(connectedUsersEmail: string){
    const collectionRef = collection(this.firestore, "users");
    collectionData<any>(collectionRef)
  }

  create(user: User): void {
    const collectionRef = collection(this.firestore, "users")
    addDoc(collectionRef, {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      authenticationMethod: user.authenticationMethod
    })
  }

  get currentUser() : User {
    return this.user;
  }
}
