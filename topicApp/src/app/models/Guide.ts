import {Restaurant} from "./Restaurant";

export interface Guide {
  id: string;
  name: string;
  description: string;
  restaurants: Restaurant[];
}
