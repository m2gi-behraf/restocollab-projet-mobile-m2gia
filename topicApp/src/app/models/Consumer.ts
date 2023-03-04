import {User} from "./User";
import {Rate} from "./Rate";
import {Restaurant} from "./Restaurant";

export interface Consumer extends User {
  id: string;
  friends: User[];
  comments: Comment[];
  ratings: Rate[];
  favoriteRestaurants: Restaurant[];
  profilePicture: string;
}
