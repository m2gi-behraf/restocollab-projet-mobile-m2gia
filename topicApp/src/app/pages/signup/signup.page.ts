import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { NavController, ToastController } from "@ionic/angular";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { User } from "../../models/User";
import { AuthenticationMethod } from "../../models/Enums/AuthenticationMethod";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  private toastController = inject(ToastController);
  private navController = inject(NavController);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthday: ['', [Validators.required, Validators.pattern('^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')])],
      confirmPassword: ['', Validators.compose([Validators.required])],
    }, {
      validators: [
        this.match('password', 'confirmPassword'),
        ]}
    );
  }

  get errorControl() {
    return this.signupForm.controls;
  }

  /**
   * Submission of the form, check all the mandatory fields and proceed to signup if good.
   */
  async submitForm() {
    this.isSubmitted = true;
    if (!this.signupForm.valid) {
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
      console.log(this.signupForm.value);

      //TODO Query to firestore to check if email already exists

      //call signUp
      const email = this.signupForm.controls['email'].value;
      const pwd = this.signupForm.controls['password'].value;
      await this.signUp(email, pwd);

      return true;
    }
  }

  /**
   * Register new user.
   * @param email User's email
   * @param password User's pwd
   */
  private async signUp(email: string, password: string): Promise<void> {
    //Creation of the user
    const user: User = {
      firstname : this.signupForm.controls['firstname'].value,
      lastname : this.signupForm.controls['lastname'].value,
      dateOfBirth : this.signupForm.controls['birthday'].value,
      email : email,
      imageUrl: "",
      authenticationMethod : AuthenticationMethod.EMAIL,
      id: Date.now().toString() + (Math.random() * 100).toFixed().toString()
    }

    //Add user in firestore
    const authResult = await this.authService.signUp(email, password)
    if (authResult[0]) {
      await this.userService.create(user);
    }

    //toast success
    this.toastController.create({
      message: "Signup successful. Please verify your email before signing in",
      duration: 1500,
      position: "bottom",
      color: 'success'
    }).then(async (toast) => {
      await toast.present()
    });
  }

  /**
   * Check if both parameters containing the same value.
   * @param controlName First parameter to compare
   * @param matchControlName Second parameter to compare
   */
  private match(controlName: string, matchControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const matchControl = controls.get(matchControlName);

      if (!matchControl?.errors && control?.value !== matchControl?.value) {
        matchControl?.setErrors({
          matching: {
            actualValue: matchControl?.value,
            requiredValue: control?.value
          }
        });
        return { mismatchedPasswords: true };
      }
      return null;
    };
  }

  /**
   * Navigate back to login page
   */
  async backToLogin() {
    await this.navController.navigateBack('login');
  }
}

