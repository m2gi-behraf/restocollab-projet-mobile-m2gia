import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable, of, ReplaySubject, Subject, switchMap } from 'rxjs';
import { Post } from '../models/post';
import { Topic } from '../models/topic';
import { Firestore, collection, collectionData, DocumentData, doc, addDoc, deleteDoc, docData, DocumentReference, CollectionReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private firestore = inject(Firestore)

  public topics$: BehaviorSubject<Topic[]> = new BehaviorSubject([] as Topic[]);

  constructor() { }

  getAll(): Observable<Topic[]> {
    const collectionRef = collection(this.firestore, `topics`);
    return collectionData<any>(collectionRef, { idField: 'id' })
  }
  /**
   * Method that returns all the topics
   *
   * @return An array of {Topic}
   */
  findAll(): Observable<Topic[]> {
    return this.getAll()
  }

  /**
   * Method that returns the topic which match the given id
   *
   * @param id {string} the given id
   * @return A {Topic}
   */
  findOne(id: string): Observable<Topic | null> {
    const documentRef = doc(this.firestore, `topics/${id}`) as DocumentReference<Topic>;
    const collectionRef = collection(this.firestore, `topics/${id}/posts`) as CollectionReference<Post>;
    return docData<Topic>(documentRef, {idField: 'id'}).pipe(
      switchMap(topic => collectionData(collectionRef, {idField: 'id'}).pipe(
        map(posts => ({
          ...topic, posts
        }))
      ))
    );
  }

  /**
   * Add a new {Topic} to the list
   *
   * @param topic {Topic}, the {Topic} to add to the list
   */
  create(topic: Topic): void {
    const collectionRef = collection(this.firestore, `topics`);
    addDoc(collectionRef, { name: topic.name })
  }

  /**
   * Remove a {Topic} from the list
   *
   * @param topic {Topic}, the {Topic} to remove from the list
   */
  delete(topic: Topic): void {
    const documentRef = doc(this.firestore, `topics/${topic.id}`) as DocumentReference<Topic>
    deleteDoc(documentRef)
  }

  /**
   * Add a new {Post} to the list of {Post} of the {Topic} that match the given topicId
   *
   * @param topicId {string}, the id of the {Topic} we want to add the new {Post}
   * @param post {Post}, the new {Post} to add
   */
  createPost(topicId: string, post: Post): void {
    const collectionRef = doc(this.firestore, `topics/${topicId}/posts`)
    //addDoc(collectionRef, { name: post.name, description: post.description})

  }

  getAllPosts(topicId: string): Observable<Post[] | null> {
    const collectionRef = collection(this.firestore, `topics/${topicId}/posts`);
    return collectionData<any>(collectionRef, { idField: 'id' }) 
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

    if (topicIndex > -1) {
      allValues[topicIndex].posts = allValues[topicIndex]?.posts.filter(p => p.id !== post.id);
      this.topics$.next(allValues);
    }
  }
}
