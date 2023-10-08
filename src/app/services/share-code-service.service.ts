import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  // deleteDoc,
  doc,
  /*arrayUnion,
  arrayRemove,
  query,
  where,
  updateDoc,
  collectionData,*/
  Firestore,
  docData,
  getDoc,
  collectionData
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { SharedCode } from '../interfaces/sharedCode.model';

@Injectable({
  providedIn: 'root'
})
export class ShareCodeService {

  private path = 'sharedCodes'

  private sharedCodeCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.sharedCodeCollection = collection(this.firestore, this.path);
  }

  create(sharedCode: SharedCode) {
    return addDoc(this.sharedCodeCollection, sharedCode);
  }


  get(id: string) {

    console.log(`${this.path}/${id}`)

    const sharedCodeDocumentReference = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(sharedCodeDocumentReference);
    //return docData(sharedCodeDocumentReference, { idField: 'id' });
  }

  /*pushUser(user: User, queueId: string){

    const queueDocumentReference = doc(
      this.firestore,
      `queue/${queueId}`
    );

    return updateDoc(queueDocumentReference, {
      'queue': arrayUnion(user)
    });
  }

  deleteMe(user: User, queueId: string){
    const queueDocumentReference = doc(
      this.firestore,
      `queue/${queueId}`
    );

    return updateDoc(queueDocumentReference, {
      'queue': arrayRemove(user)
    });
  }*/

  /*getAll(userId: string) {

    const colQuery = query(this.queueCollection, where('userId', '==', userId));
    return collectionData(colQuery, { idField: 'id' })

  }*/

  /*update(queue: SharedCode) {
    const queueDocumentReference = doc(
      this.firestore,
      `queue/${queue.id}`
    );
    return updateDoc(queueDocumentReference, { ...queue });
  }*/

  /*delete(id: string) {
    const queueDocumentReference = doc(this.firestore, `queue/${id}`);
    return deleteDoc(queueDocumentReference);
  }*/


}

