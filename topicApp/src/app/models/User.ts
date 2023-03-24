import {AuthenticationMethod} from "./Enums/AuthenticationMethod";

/**
 * Défini l'utilisateur
 */
export interface User {
  id: string;
  username: string;
  lastname: string;
  firstname: string;
  dateOfBirth: Date | any;
  email: string;
  /**
   * Défini la méthode d'autentification, Facebook, Google ou email.
   */
  authenticationMethod: AuthenticationMethod;
  imageUrl: string;
}
