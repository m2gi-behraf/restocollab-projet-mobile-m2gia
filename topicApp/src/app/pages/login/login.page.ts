import {Component, inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, Form} from "@angular/forms";
import {ToastController, NavController} from "@ionic/angular";
import {SignupPage} from "../signup/signup.page";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false;
  private toastController = inject(ToastController);
  constructor(private formBuilder: FormBuilder, public navigationControl: NavController) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    })
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async login() {
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
      const toast = await this.toastController.create({
        message: "Login successful.",
        duration: 1500,
        position: "bottom",
        color: 'success'
      });
      await toast.present();
      console.log(this.loginForm.value);
      return true;
    }
  }

  goSignUp() {
    this.navigationControl.navigateForward('signup');
  }
}
