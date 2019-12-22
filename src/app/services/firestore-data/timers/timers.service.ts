import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { FirestoreDataService } from '../firestore-data.service';
import { Timer } from '@app/models';
import { AngularFireAuth } from '@angular/fire/auth';
import { differenceInMinutes } from 'date-fns';

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

  start(id: string): Promise<void> {
    return this.collection.doc(id).update({
      startTime: Date.now()
    });
  }

  async stop(id: string): Promise<void> {
    const document = this.collection.doc(id);
    const snapshot = await document.ref.get();
    const timer = snapshot.data();
    const minutes = (timer.minutes || 0) + differenceInMinutes(Date.now(), timer.startTime);
    document.update({ startTime: null, minutes });
  }
}
