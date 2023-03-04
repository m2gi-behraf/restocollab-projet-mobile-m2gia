import {Rate} from "./Rate";
import {RestaurantCategories} from "./Enums/RestaurantCategories";
import {CountryCuisine} from "./Enums/CountryCuisine";

export interface Restaurant {
  id: string;
  title: string;
  description: string;
  categories: RestaurantCategories[]
  countryCuisine: CountryCuisine;

  /**
   * Adresse postale
   */
  address: string;

  /**
   * Coordonnées GPS
   */
  coordinates: [number, number];

  /**
   * Avis laissés sur 5
   */
  rates: Rate[];

  /**
   * Commentaires laissés
   */
  comments: Comment[];

  /**
   * Collection d'URLs d'images
   */
  thumbnails: string[];
}
