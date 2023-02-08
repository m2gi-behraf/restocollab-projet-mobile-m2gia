import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { Post } from '../models/post';
import { Topic } from '../models/topic';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  public topics$: BehaviorSubject<Topic[]> = new BehaviorSubject([
    {id: '123', name: 'test', posts: []}, 
    {id: '465', name: 'test2', posts: []}
  ] as Topic[]);

  constructor() { }

  /**
   * Method that returns all the topics
   *
   * @return An array of {Topic}
   */
  findAll(): Observable<Topic[]> {
    return this.topics$.asObservable();
  }

  /**
   * Method that returns the topic which match the given id
   *
   * @param id {string} the given id
   * @return A {Topic}
   */
  findOne(id: string): Observable<Topic | null> {
    return this.findAll().pipe(
      map(topics => topics.find(t => t.id === id) ?? null)
    );
  }

  /**
   * Add a new {Topic} to the list
   *
   * @param topic {Topic}, the {Topic} to add to the list
   */
  create(topic: Topic): void {
    this.topics$.next(this.topics$.value.concat(topic));
  }

  /**
   * Remove a {Topic} from the list
   *
   * @param topic {Topic}, the {Topic} to remove from the list
   */
  delete(topic: Topic): void {
    this.topics$.next(this.topics$.value.filter(t => t.id !== topic.id));
  }

  /**
   * Add a new {Post} to the list of {Post} of the {Topic} that match the given topicId
   *
   * @param topicId {string}, the id of the {Topic} we want to add the new {Post}
   * @param post {Post}, the new {Post} to add
   */
  createPost(topicId: string, post: Post): void {
    const allValues = this.topics$.value;
    const topicIndex = allValues.findIndex(t => t.id === topicId);

    if(topicIndex > -1) {
      allValues[topicIndex].posts = allValues[topicIndex]?.posts.concat(post);
      this.topics$.next(allValues);
    }
  }

  /**
   * Remove a {Post} from the list of {Post} of the {Topic} that match the given topicId
   *
   * @param topicId {string}, the id of the {Topic} we want to remove the {Post}
   * @param post {Post}, the {Post} to remove
   */
  deletePost(topicId: string, post: Post): void {
    const allValues = this.topics$.value;
    const topicIndex = this.topics$.value.findIndex(t => t.id === topicId);

    if(topicIndex > -1){
      allValues[topicIndex].posts = allValues[topicIndex]?.posts.filter(p => p.id !== post.id);
      this.topics$.next(allValues);
    }
  }
}
