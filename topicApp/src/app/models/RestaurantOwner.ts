import {User} from "./User";
import {Restaurant} from "./Restaurant";

/**
 * Défini un restaurant owner
 */
export interface RestaurantOwner extends User{
  /**
   * Restaurant associé
   */
  restaurant: Restaurant;
}
