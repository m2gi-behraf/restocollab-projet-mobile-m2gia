/**
 * Define the class Restaurant
 */
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  imageURL : string;
  ranking: number;
  /**
   * Adresse postale
   */
  address: string;

  /**
   * Coordonnées GPS
   */
  coordinates: [number, number];

  /**
   * Collection d'URLs d'images
   */
  thumbnails: string[];
}
