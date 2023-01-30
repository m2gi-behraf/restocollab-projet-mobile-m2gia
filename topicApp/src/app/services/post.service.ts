import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Topic } from '../models/topic';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _allPosts: Map<number, Array<Post>>;

  constructor() { 
    this._allPosts = new Map();
    
    this._allPosts.set(1, new Array(
      {id: 1, name:"Post 1", description:"Ceci est le post 1"} as Post,
      {id: 2, name:"Post 2", description:"Ceci est le post 2"} as Post,
      {id: 3, name:"Post 3", description:"Ceci est le post 3"} as Post,
    ));
    
    this._allPosts.set(2, new Array(
      {id: 4, name:"Post 4", description:"Ceci est le post 4"} as Post,
      {id: 5, name:"Post 5", description:"Ceci est le post 5"} as Post,
    ));
  }

  /**
   * Créer un post et l'ajoute dans la liste
   * @param name Nom du post
   * @param description Description du post
   * @param topic Topic parent contenant le post à créer
   * @returns 
   */
  create(name: string, description: string, topic: Topic) : void{
    if (topic == undefined || name == undefined || description == undefined)
      return;
      
    const post = {
      id: this.newId(),
      name: name,
      description: description
    }

    if (this._allPosts.has(topic.id)){
      this._allPosts.get(topic.id)?.push(post);
    }
    else{
      this._allPosts.set(topic.id, new Array(post));
    }
  }

  /**
   * Récupère tous les post d'un topic
   * @param topic Topic dont on veut les posts
   * @returns Tableau de Post
   */
  getAll(topic: Topic): Array<Post>
  {
    if (topic == undefined || !this._allPosts.has(topic.id)) 
      return new Array();

    return this._allPosts.get(topic.id) ?? new Array();
  }

  /**
   * Supprime le post
   * @param post Post à supprimer
   * @param topic Topic contenant le post
   */
  delete(post: Post, topic: Topic): void{
    if (topic == undefined || !this._allPosts.has(topic.id)) return;
    let posts = this._allPosts.get(topic.id);
    
    if (posts != undefined && posts.indexOf(post) >= 0){
      posts?.splice(posts?.indexOf(post), 1);
    }
  }

   /**
   * Génère un nouvel Id
   * @returns Nouvel Id, nombre compris entre 1 et 10000
   */
  newId() : number{
    return Math.floor(Math.random() * 10000, )
  }
}
