import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
filterRestaurantName: any;

// todo: backend side - create around 9 restaurants 
  restaurantsList = [
    {thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-la-ferme-a-dede.png", restaurantName: "La Ferme à Dédé", ranking: "4", cuisine: "🇫🇷", address:  "24 Rue Barnave, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-au-liban.png", restaurantName: "Au Liban", ranking: "4", cuisine: "🇱🇧", address:  "16 Pl. Sainte-Claire, 38000 Grenoble"},
    {thumbnailURL: "../../assets/images/home/restaurant-comptoire-ditalie.png", restaurantName: "Comptoire d'Italie", ranking: "4", cuisine: "🇮🇹", address:  "4 Pl. de Gordes, 38000 Grenoble"},
  ]

  //todo: implement service to fetch restaurants

  constructor() { }

  ngOnInit() {
  }

  clickMe() {
    console.log("yassss");
  }
}
