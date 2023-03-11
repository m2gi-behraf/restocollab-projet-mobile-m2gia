import {inject, Injectable} from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential } from "@angular/fire/auth";
import { User, sendEmailVerification, sendPasswordResetEmail, GoogleAuthProvider} from '@firebase/auth'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {isPlatform} from "@ionic/angular";

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
      console.log("Auth State Changed -> ", user);
    });

    //Specific Web
    if(!isPlatform('capacitor')){
      GoogleAuth.initialize();
    }
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
    return signInWithEmailAndPassword(this.afAuth, email, password);
  }

  /**
   * Sign up a new user with email and password
   * @param email User's email
   * @param password User's password
   */
  SignUp(email: string, password: string) : Promise<boolean>{
    return createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        this.user = userCredential.user;
        //this.SendVerificationEmail();
        return true;
      })
      .catch((error) => {
        console.error("Error create User",error);
        return false;
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

  async signInWithGoogle(){
    const googleUser = await GoogleAuth.signIn();
    const googleCredentials = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    signInWithCredential(this.afAuth, googleCredentials).then((userCredential) => {
      console.log("SIGN IN OK", userCredential);
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Send the password reset email
   * @param email receiver's email
   */
  forgotPassword(email: string){
    return sendPasswordResetEmail(this.afAuth, email);
  }

}
