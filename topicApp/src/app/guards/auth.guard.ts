import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService)
  private navController = inject(NavController)
  constructor() {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn){
      this.navController.navigateRoot(['sign-in'])
        .then((hasNavigated) => {
          console.log("Redirection to sign in page. -> ", hasNavigated)
        })
        .catch((error) => {
          console.error("Error Redirection to sign-in page", error())
        })
    }
    return true;
  }
}
