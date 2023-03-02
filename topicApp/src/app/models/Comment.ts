import {Restaurant} from "./Restaurant";
import {User} from "./User";

export interface Comment {
  MAX_LENGTH: number;

  id: string;
  restaurant: Restaurant;
  author: User;
  content: string;
  date: Date;
}
