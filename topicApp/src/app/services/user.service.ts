import {inject, Injectable} from '@angular/core';
import { User } from "../models/User";
import { addDoc, collection, doc, where, query, Firestore, getDocs, DocumentReference, docData } from '@angular/fire/firestore';
import {AuthenticationMethod} from "../models/Enums/AuthenticationMethod";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly DEFAULT_USER: User = {
    firstname: "DEFAULT",
    lastname: "DEFAULT",
    id: "",
    authenticationMethod: AuthenticationMethod.EMAIL,
    dateOfBirth: new Date("2000-01-01"),
    email: "DEFAULT@gmail.com",
    imageUrl: "https://raw.githubusercontent.com/a6digital/laravel-default-profile-image/master/docs/images/profile.png"
  };
  private user: User = this.DEFAULT_USER

  private firestore = inject(Firestore)
  constructor() { }

  /**
   * Get the User class of the matching user with the same email address.
   * @param email User's email
   */
  async getUser(email: string): Promise<User | null> {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    //check if query have matches
    if (!querySnapshot.empty && querySnapshot.docs[0].exists()) {
      const id = querySnapshot.docs[0].id
      const docRef = doc(this.firestore, `users/${id}`) as DocumentReference<User>
      return firstValueFrom(docData(docRef)) //return first match in a Promise
    }
    else {
      return null
    }
  }

  /**
   * Check if the given email is already in the registered user's collection.
   * @param email Email to verify
   */
  async isEmailAlreadyRegistered(email: string): Promise<boolean> {
    const user = await this.getUser(email);
    return user !== null;
  }

  /*
   * Get the database user matching the given email.
   * Set up the current user with the one got
   * @param email User's email to set up.
   */
  async setUpCurrentUser(email: string) {
    await this.getUser(email).then((user) => {
        this.user = (user) ? user : this.DEFAULT_USER
        console.log("Current User", user);
      })
      .catch((error) => {
        console.error(error)
      })
  }

  /**
   * Create or get the database user matching the given user's email address.
   * If the user is not registered yet, create it with the provider's infos.
   * Set up the current user with the one got or created
   * @param user User to set up.
   */
  async setUpCurrentUserFromGoogle(user: User) {
    await this.getUser(user.email).then(async (dbUser) => {
        if (dbUser === null) {
          await this.create(user);
          this.user = user;
        }
        else {
          this.user = dbUser;
        }
    }).catch((error) => {
      console.error(error);
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
