import {Restaurant} from "./Restaurant";

export interface RestaurantsList {
  id: string;
  name: string;
  description: string;
  restaurants: Restaurant[];
  address: string;
  cuisine: string;
  imageURL : string;
  ranking: number;
  /**
   * Map <UserID, Role> where Role equals 'writer', 'owner', 'reader'
   */
  roles: Map<string, string>;
}
