import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Customer } from '@app/models';
import firebase from 'firebase/app';
import { of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root',
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

  convertCustomers() {
    this.afAuth.user
      .pipe(
        take(1),
        mergeMap(user =>
          user
            ? this.getCollection(user)
                .snapshotChanges()
                .pipe(take(1), map(this.customersNeedingConversion))
            : of([]),
        ),
      )
      .subscribe(customers => {
        customers.forEach(customer => this.update(this.convert(customer)));
      });
  }

  private convert(customer: any): Customer {
    const converted: Customer = {
      id: customer.id,
      name: customer.name,
      hasAdvisory: customer.hasAdvisory || false,
      supportHours: customer.supportHours || 0,
      isActive: true,
    };

    if (customer.hasAdvisory) {
      converted.primaryAdvisor = customer.primaryAdvisor;
    }

    return converted;
  }

  private customersNeedingConversion(
    actions: Array<DocumentChangeAction<Customer>>,
  ): Array<Customer> {
    const all = actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data } as Customer;
    });
    return all.filter(x => x.isActive === undefined);
  }
}
