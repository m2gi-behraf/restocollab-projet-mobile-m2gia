import { Injectable } from '@angular/core';
import { Topic } from '../models/topic';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private _allTopics: Array<Topic>;

  constructor() 
  {
    this._allTopics = new Array(); 
  }

  /**
   * Récupère tous les topics
   * @returns Tous les topics
   */
  findAll(): Array<Topic>
  {
    return this._allTopics;
  }

  /**
   * Retourne le topic correspondant à l'id
   * @param id Identifiant du topic à trouver
   */
  findOneById(id: number): Topic | undefined
  {
    let filteredArray = this._allTopics.filter(x => x.id == id);
    if (filteredArray != null && filteredArray.length >= 1)
      return filteredArray[0]

    return undefined;
  }

  /**
   * Ajoute un topic
   * @param topic Topic à ajouter
   */
  createTopic(topic: Topic){
    this._allTopics.push(topic);
  }
}
