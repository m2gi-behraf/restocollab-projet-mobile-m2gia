import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {NavController, ToastController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  private toastController = inject(ToastController);
  private authService = inject(AuthService);
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder, public navigationControl: NavController) { }

  ngOnInit() {

    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthday: ['', [Validators.required]],
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

      //call signUp
      const email = this.signupForm.controls['email'].value;
      const pwd = this.signupForm.controls['password'].value;
      this.signUp(email, pwd);

      return true;
    }
  }

  /**
   * Register new user.
   * @param email User's email
   * @param password User's pwd
   */
  private signUp(email: string, password: string){
    //Create User using UserService
    //Passing created user to authService.
    this.authService.SignUp(email, password).then(async (success) => {
      this.toastController.create({
        message: "Signup successful.",
        duration: 1500,
        position: "bottom",
        color: 'success'
      }).then(async (toast) => {
        await toast.present()
      });
    }).catch((error) => {
        console.log("Signup subsciption", error);
      })
  }

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

  goLogin() {
    this.navigationControl.navigateForward('login');
  }
}

