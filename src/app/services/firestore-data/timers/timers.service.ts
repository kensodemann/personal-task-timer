import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreDataService } from '../firestore-data.service';
import { Timer } from '@app/models';
import { differenceInMinutes } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class TimersService extends FirestoreDataService<Timer> {
  constructor(private ngFirestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  getCollection(user: firebase.User): AngularFirestoreCollection<Timer> {
    return this.ngFirestore
      .collection('users')
      .doc((user && user.uid) || 'unknown')
      .collection('timers');
  }

  async start(id: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    return this.getCollection(user).doc(id).update({
      startTime: Date.now()
    });
  }

  async stop(id: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    const document = this.getCollection(user).doc(id);
    const snapshot = await document.ref.get();
    const timer = snapshot.data();
    const minutes = (timer.minutes || 0) + differenceInMinutes(Date.now(), timer.startTime);
    document.update({ startTime: null, minutes });
  }
}
