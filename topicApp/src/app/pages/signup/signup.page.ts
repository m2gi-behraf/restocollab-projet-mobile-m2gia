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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  private toastController = inject(ToastController);
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
        this.Match('password', 'confirmPassword'),
        ]}
    );
  }

  get errorControl() {
    return this.signupForm.controls;
  }

  async signup() {
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
      const toast = await this.toastController.create({
        message: "Signup successful.",
        duration: 1500,
        position: "bottom",
        color: 'success'
      });
      await toast.present();
      console.log(this.signupForm.value);
      return true;

    }
  }

  private Match(controlName: string, matchControlName: string): ValidatorFn {
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

