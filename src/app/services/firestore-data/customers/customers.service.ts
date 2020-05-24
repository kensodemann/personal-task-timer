import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Customer } from '@app/models';
import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends FirestoreDataService<Customer> {
  constructor(private ngFirestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  getCollection(user: firebase.User): AngularFirestoreCollection<Customer> {
    return this.ngFirestore
      .collection('users')
      .doc((user && user.uid) || 'unknown')
      .collection('customers');
  }
}
