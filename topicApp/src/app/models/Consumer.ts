import {User} from "./User";
import {Rate} from "./Rate";
import {Restaurant} from "./Restaurant";
import {AuthenticationMethod} from "./Enums/AuthenticationMethod";

export interface Consumer extends User {
  friends: User[];
  comments: Comment[];
  ratings: Rate[];
  favoriteRestaurants: Restaurant[];
  profilePicture: string;

}
