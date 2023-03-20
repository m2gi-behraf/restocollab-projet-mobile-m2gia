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
import {AuthenticationMethod} from "../models/Enums/AuthenticationMethod";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly defaultUser: User = {
    firstname: "DEFAULT",
    lastname: "DEFAULT",
    id: "",
    authenticationMethod: AuthenticationMethod.EMAIL,
    dateOfBirth: new Date("2000-01-01"),
    email: "DEFAULT@gmail.com",
    imageUrl: "https://raw.githubusercontent.com/a6digital/laravel-default-profile-image/master/docs/images/profile.png"
  };
  private user: User = this.defaultUser

  private firestore = inject(Firestore)
  constructor() {
  }

  // Todo implementer le getUser
  async getUser(email: string): Promise<User | null> {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && querySnapshot.docs[0].exists()) {
      const id = querySnapshot.docs[0].id
      const docRef = doc(this.firestore, `users/${id}`) as DocumentReference<User>
      return firstValueFrom(docData(docRef))
    }
    else{
      return null
    }
  }

  async setUpCurrentUser(email: string) {
    await this.getUser(email).
      then((user) => {
        this.user = (user) ? user : this.defaultUser
        console.log("Current User", user);
      })
      .catch((error) => {
        console.error(error)
      })
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

}
