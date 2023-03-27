import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastController, NavController, ModalController } from "@ionic/angular";
import { AuthService } from "../../services/auth.service";
import { ForgotPasswordComponent } from "../../modals/forgot-password/forgot-password.component";
import { UserService } from "../../services/user.service";
import { FirebaseError } from '@firebase/util';
import { AuthErrorCodes , User as FireUser} from '@firebase/auth';
import {User} from "../../models/User";
import {AuthenticationMethod} from "../../models/Enums/AuthenticationMethod";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  errorMessage = "";
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);
  private navController = inject(NavController);
  private authService = inject(AuthService)
  private userService = inject(UserService)
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    })
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  /**
   * Submit the form and check for invalid fields.
   */
  async submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      const toast = await this.toastController.create({
        message: "Please make sure you provided all required values correctly.",
        duration: 1500,
        position: "bottom",
        color: 'danger'
      });
      await toast.present();
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.loginForm.value);
      await this.signIn(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value);
      return true;
    }
  }

  /**
   * Try to sign-in user with his credentials, handle errors and redirect to home of there aren't.
   * @param email User's email
   * @param password User's password
   */
  private async signIn(email: string, password: string){
    try {
      const userCredential = await this.authService.signIn(email, password);
      console.log(userCredential)
      if (userCredential != null) {

        //Check mail is verified here bc Firebase does not throw error if email not verified
        if(!userCredential.user.emailVerified){
          this.toastController.create({
            message: "Please, verify your email before signing in",
            duration: 1500,
            position: "bottom",
            color: 'danger'
          }).then(async (toast) => {
            await toast.present();
          });

          //Disconnect user
          await this.authService.signOut();
          return;
        }

        //Set up user Data
        await this.userService.setUpCurrentUser(userCredential.user.uid ?? "")
        await this.redirectToHome()
      }
    }
    catch (error: unknown) {
      //todo handle error visually
      if (error instanceof FirebaseError){
        this.showSignInErrorMessages(error)
      }
      else {
        console.error(error)
      }
    }
  }

  /**
   * Show a toast with the reason of the failed sign in
   * @param error
   */
  showSignInErrorMessages(error: FirebaseError) {
    let message = ""
    switch (error.code) {
      case AuthErrorCodes.USER_DELETED :
        message = "No user found with the specified mail"
        break

      case AuthErrorCodes.INVALID_PASSWORD :
        message = "The specified password is invalid"
        break

      case AuthErrorCodes.UNVERIFIED_EMAIL :
        message = "Please, verify your email before signing in"
        break
    }

    this.toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: 'danger'
    }).then(async (toast) => {
      await toast.present();
    });
  }

  /**
   * Navigate to signup page.
   */
  async navToSignUp() {
    await this.navController.navigateForward('signup');
  }

  /**
   * Show modal for the forgot password form
   */
  async forgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent,
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  /**
   * Redirect to log in form with Google account
   */
  async signInWithGoogle() {
    const result = await this.authService.signInWithGoogle()
    console.log(result);
    if (result[0]) {
      //Creation of the user
      const fireUser = result[1] as FireUser;
      const user: User = this.userService.DEFAULT_USER;
      user.id = fireUser.uid;
      user.imageUrl = fireUser.photoURL ?? user.imageUrl;
      user.firstname = fireUser.displayName ?? user.firstname;
      user.lastname = "";
      user.email = fireUser.email ?? user.email;
      user.authenticationMethod = AuthenticationMethod.GOOGLE;
      user.username = fireUser.displayName ?? user.firstname.concat(user.lastname);

      //Set up current user
      await this.userService.setUpCurrentUserFromGoogle(user)
      await this.redirectToHome();
    }
    else {
      console.log(result[2]);
    }
  }

  /**
   * Redirect to the home page.
   */
  private async redirectToHome() {
    return await this.navController.navigateRoot('dashboard/tabs/home');
  }
}
