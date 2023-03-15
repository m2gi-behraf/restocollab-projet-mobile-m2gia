/**
 * Define the class Restaurant
 */
export interface Restaurant {
  id: string;
  title: string;
  description: string;

  /**
   * Adresse postale
   */
  address: string;

  /**
   * Coordonnées GPS
   */
  coordinates: [number, number];

  /**
   * Commentaires laissés
   */
  comments: Comment[];

  /**
   * Collection d'URLs d'images
   */
  thumbnails: string[];
}
