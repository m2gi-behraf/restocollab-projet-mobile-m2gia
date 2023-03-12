import {Role} from "./Enums/Role";
import {AuthenticationMethod} from "./Enums/AuthenticationMethod";

/**
 * Défini l'utilisateur
 */
export interface User {
  id: string;
  lastname: string;
  firstname: string;
  dateOfBirth: Date;
  email: string;
  /**
   * Indique si l'utilisateur est un RestaurantOwner ou un Consumer
   */
  role: Role;
  /**
   * Défini la méthode d'autentification, Facebook, Google ou email.
   */
  authenticationMethod: AuthenticationMethod;
  imageUrl: string;
}
