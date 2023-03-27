import {inject, Injectable} from '@angular/core';
import { User } from "../models/User";
import {
  collection,
  doc,
  where,
  query,
  Firestore,
  getDocs,
  DocumentReference,
  docData,
  setDoc, collectionData, CollectionReference
} from '@angular/fire/firestore';
import {AuthenticationMethod} from "../models/Enums/AuthenticationMethod";
import {firstValueFrom, Observable, of} from "rxjs";
import {firebaseApp$} from "@angular/fire/app";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly ROOT = "users"
  readonly DEFAULT_USER: User = {
    username: "DEFAULT",
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

  async findByUsername(username: string) : Promise<User | null> {
    console.log("findByUsername", username)
    const usersRef = collection(this.firestore, `${this.ROOT}`);
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    //check if query have matches
    if (!querySnapshot.empty && querySnapshot.docs[0].exists()) {
      const id = querySnapshot.docs[0].id
      const docRef = doc(this.firestore, `${this.ROOT}/${id}`) as DocumentReference<User>
      return firstValueFrom(docData(docRef, { idField: 'id' })) //return first match in a Promise
    }
    else {
      return null
    }
  }

  /**
   * Try to find a USer inside firestore collection matching given id
   * @param restaurantId Id of restaurant
   */
  findOne(id: string): Observable<User>{
    const documentRef = doc(this.firestore, `${this.ROOT}/${id}`) as DocumentReference<User>;
    return docData<User>(documentRef, {idField: 'id'})
  }

  /**
   * Return all the users
   */
  findAll(): Observable<User[]> {
    const usersRef = collection(this.firestore, `${this.ROOT}`) as CollectionReference<User>;
    return collectionData(usersRef, {idField: 'id'})
  }

  /**
   * Return all restaurants matching given ids
   */
  findAllById(ids: string[]): Observable<User[]> {
    let users: User[] = new Array<User>()
    ids.forEach(async (id) => {
      let user = await firstValueFrom(this.findOne(id)) as User
      users.push(user);
    });
    return of(users);
  }

  /**
   * Check if the given email is already in the registered user's collection.
   * @param email Email to verify
   */
  async isUsernameAlreadyRegistered(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return user !== null;
  }

  /*
   * Get the database user matching the given email.
   * Set up the current user with the one got
   * @param email User's email to set up.
   */
  async setUpCurrentUser(id: string) {
    await firstValueFrom(this.findOne(id)).then((user) => {
      this.user = (user) ? user : this.DEFAULT_USER
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
    await firstValueFrom(this.findOne(user.id)).then(async (dbUser) => {
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
    setDoc(doc(this.firestore, "users", `${user.id}`), {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      imageUrl: user.imageUrl,
      dateOfBirth: user.dateOfBirth,
      authenticationMethod: user.authenticationMethod
    });
  }

  get currentUser() : User {
    return this.user;
  }
}
