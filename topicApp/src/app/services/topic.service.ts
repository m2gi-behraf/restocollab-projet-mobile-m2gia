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
    
    //Jeu de données
    const top1 = {id: 1, name:"Topic 1"} as Topic;
    const top2 = {id: 2, name:"Topic 2"} as Topic;
    const top3 = {id: 3, name:"Topic 3"} as Topic;
    
    this._allTopics.push(top1, top2, top3)
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
  create(topic: Topic){
    this._allTopics.push(topic);
  }

  /**
   * Supprime un topic.
   * @param topic Topic à supprimer
   */
  delete(topic: Topic){
    let index = this._allTopics.indexOf(topic)
    if (index != -1){
      this._allTopics.splice(index, 1)
    }
  }
}
