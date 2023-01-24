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

  create(post: Post, topic: Topic) : void{
    if (topic == undefined || post == undefined)
      return;
      
    if (this._allPosts.has(topic.id)){
      this._allPosts.get(topic.id)?.push(post);
    }
    else{
      this._allPosts.set(topic.id, new Array(post))
    }
  }

  getAll(topic: Topic): Array<Post>
  {
    if (topic == undefined || !this._allPosts.has(topic.id)) 
      return new Array();

    return this._allPosts.get(topic.id) ?? new Array();
  }

  delete(post: Post, topic: Topic): void{
    if (topic == undefined || !this._allPosts.has(topic.id)) return;
    let posts = this._allPosts.get(topic.id);

    if (posts?.indexOf(post) ?? -1 >= 0){
      posts?.splice(posts?.indexOf(post), 1);
    }
  }
}
