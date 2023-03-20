import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController, NavController, ToastController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {ForgotPasswordComponent} from "../../modals/forgot-password/forgot-password.component";
import {UserService} from "../../services/user.service";
import {FirebaseError} from '@firebase/util';
import {AuthErrorCodes, User as FireUser} from '@firebase/auth';
import {User} from '../../models/User';
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

  private async signIn(email: string, password: string){
    try {
      const userCredential = await this.authService.signIn(email, password);

      if (userCredential != null) {
        await this.userService.setUpCurrentUser(userCredential.user.email ?? "")
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

  goSignUp() {
    this.navController.navigateForward('signup');
  }

  async forgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent,
    });
    modal.present();
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
      user.imageUrl = fireUser.photoURL ?? user.imageUrl;
      user.firstname = fireUser.displayName ?? user.firstname;
      user.lastname = "";
      user.email = fireUser.email ?? user.email;
      user.authenticationMethod = AuthenticationMethod.GOOGLE;

      //Set up current user
      await this.userService.setUpCurrentUserFromGoogle(user)
      await this.redirectToHome();
    }
    else {
      console.log(result[2]);
    }
  }

  private async redirectToHome() {
    return await this.navController.navigateRoot('dashboard/tabs/home');
  }
}
