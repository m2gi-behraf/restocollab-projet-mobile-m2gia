import {inject, Injectable} from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, signOut } from "@angular/fire/auth";
import { User, sendEmailVerification, sendPasswordResetEmail, GoogleAuthProvider} from '@firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {isPlatform, NavController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Current Firebase User
   */
  private fireUser: User | null
  private afAuth = inject(Auth)
  private navController = inject(NavController)

  constructor() {
    this.fireUser = this.afAuth.currentUser;

    //Specific Web to initialize Google Auth
    if(!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }

    this.afAuth.onAuthStateChanged(async (user) => {
      console.log("Auth State Changed -> ", user);
      this.fireUser = user;

      if (user === null) {
        console.log("User logged out, redirect to login")
        await this.redirectToLogin();
      }
    });
  }

  /**
   * Indicate if the current User is logged in and if it's email is verified
   */
  get isLoggedIn(): boolean {
    return this.fireUser !== null && this.fireUser.emailVerified
  }

  /**
   * Sign in an existent user with email and password
   * @param email User's email
   * @param password User's password
   */
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   */
  async signUp(email: string, password: string): Promise<[success: boolean, user: User | null, error: any | null]> {
    try {
      const credential = await createUserWithEmailAndPassword(this.afAuth, email, password);
      this.fireUser = credential.user;
      await sendEmailVerification(credential.user);
      return [true, this.fireUser, null];
    }
    catch (error) {
      console.error("Error create user", error);
      return [false, null, error];
    }
  }

  /**
   * Sign ou the current authentication
   */
  async signOut(){
    await GoogleAuth.signOut();
    await signOut(this.afAuth);
    await this.redirectToLogin();
  }

  /**
   * Sign in with Google provider
   */
  async signInWithGoogle(): Promise<[success: boolean, user: User | null, error: any | null]> {
    try {
      const googleUser = await GoogleAuth.signIn()
      const googleCredentials = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      const credential = await signInWithCredential(this.afAuth, googleCredentials);
      console.log("User logged in with Google provider");
      return [true, credential.user, null];
    }
    catch (error) {
      console.error("Error sign in Google", error);
      return [false, null, error];
    }
  }

  /**
   * Send the password reset email
   * @param email receiver's email
   */
  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.afAuth, email);
  }

  /**
   * Redirect to login page
   */
  private async redirectToLogin(): Promise<void> {
    await this.navController.navigateRoot('login');
  }
}
