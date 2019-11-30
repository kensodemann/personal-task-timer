import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { FirestoreDataService } from '../firestore-data.service';
import { Timer } from '@app/models';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TimersService extends FirestoreDataService<Timer> {
  constructor(private ngFirestore: AngularFirestore, private afAuth: AngularFireAuth) {
    super();
  }

  protected getCollection(): AngularFirestoreCollection<Timer> {
    if (this.afAuth.auth.currentUser) {
      return this.ngFirestore
        .collection('users')
        .doc(this.afAuth.auth.currentUser.uid)
        .collection('timers');
    }
  }

  // protected actionsToData(actions: Array<DocumentChangeAction<Timer>>): Array<Timer> {
  //   return actions.map(a => {
  //     const data = a.payload.doc.data();
  //     const id = a.payload.doc.id;
  //     return {
  //       id,
  //       beginDate: ((data as any).beginDate as firestore.Timestamp).toDate()
  //     };
  //   });
  // }

  // async get(id: string): Promise<Timer> {
  //   const doc = await super.get(id);
  //   if (doc && doc.beginDate) {
  //     doc.beginDate = new Date((doc.beginDate as any).seconds * 1000);
  //   }
  //   return doc;
  // }
}
