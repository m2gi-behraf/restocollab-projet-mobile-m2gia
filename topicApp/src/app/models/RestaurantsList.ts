import {Restaurant} from "./Restaurant";

export interface RestaurantsList {
  id: string;
  name: string;
  description: string;
  restaurants: Restaurant[];

  /**
   * Map <UserID, Role> where Role equals 'writer', 'owner', 'reader'
   */
  roles: Map<string, string>;
}
