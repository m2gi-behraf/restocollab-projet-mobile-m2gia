import {Component, inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, Form} from "@angular/forms";
import {ToastController, NavController, ModalController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {ForgotPasswordComponent} from "../../modals/forgot-password/forgot-password.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false;
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);
  private authService = inject(AuthService)
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
      this.signIn(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value);
      return true;
    }
  }

  private signIn(email: string, password: string){
    this.authService.SignIn(email, password).then((userCred) => {
      this.toastController.create({
        message: "Login successful.",
        duration: 1500,
        position: "bottom",
        color: 'success'
      }).then(async (toast) => {
        await toast.present();
      });
    }).catch((error) => {
      console.log(error)
    });
  }

  goSignUp() {
    this.navigationControl.navigateForward('signup');
  }

  async forgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
