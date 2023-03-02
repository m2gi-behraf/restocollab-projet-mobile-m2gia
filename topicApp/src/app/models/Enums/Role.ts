export enum Role {
  /**
   * Possède un restaurant, ne peux pas noter les autres restaurants.
   * Peut modérer les commentaires de son restaurant
   */
  RestaurantOwner = 0,
  /**
   * Peut noter, commenter une fois chaque restaurant.
   */
  Consumer = 1
}
