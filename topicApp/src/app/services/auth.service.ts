import {inject, Injectable} from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { User, sendEmailVerification, sendPasswordResetEmail} from '@firebase/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Current Firebase User
   */
  private user: User | null
  private afAuth = inject(Auth)

  constructor() {
    this.user = this.afAuth.currentUser;
    this.afAuth.onAuthStateChanged((user) => {
      this.user = user;
      //TODO Fabien -> Set up user data
    });
  }

  /**
   * Indicate if the current User is logged in and if it's email is verified
   */
  get isLoggedIn(): boolean {
    return this.user !== null && this.user.emailVerified
  }

  /**
   * Sign in an existent user with email and password
   * @param email User's email
   * @param password User's password
   */
  SignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        //TODO Fabien -> Set up user data
        console.log("User logged in", userCredential.user)
      })
      .catch((error) => {
        console.error("Error signin user", error)
      });
  }

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   */
  SignUp(email: string, password: string){
    return createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        this.user = userCredential.user;
        console.log("User created", this.user)
        this.SendVerificationEmail();
        //TODO Fabien -> Set up user data
      })
      .catch((error) => {
        console.error("Error create User",error);
      });
  }

  /**
   * Send a verification Email to the created user
   */
  private SendVerificationEmail(){
    if (this.user == null) {
      console.error("Send Verification Email failed, user null");
      return;
    }

    sendEmailVerification(this.user)
      .then(() => {
        console.log("Verification mail sent", this.user);
      })
  }

  /**
   * Send the password reset email
   * @param email receiver's email
   */
  private SendResetPasswordEmail(email: string){
    return sendPasswordResetEmail(this.afAuth, email)
      .then(() => {
        console.log("Reset password email sent");
      })
      .catch((error) => {
        console.error("Error Reset password email", error)
      })
  }

}
