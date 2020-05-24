import { AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth/auth';

import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export abstract class FirestoreDataService<T extends { id?: string }> {
  constructor(protected afAuth: AngularFireAuth) {}

  observeChanges(): Observable<Array<DocumentChangeAction<T>>> {
    return this.afAuth.user.pipe(flatMap(user => this.getCollection(user).stateChanges()));
  }

  async get(id: string): Promise<T> {
    const user = await this.afAuth.currentUser;
    const doc = await this.getCollection(user).doc<T>(id).ref.get();
    return { id, ...(doc && doc.data()) } as T;
  }

  async add(item: T): Promise<DocumentReference> {
    const user = await this.afAuth.currentUser;
    return this.getCollection(user).add(item);
  }

  async delete(item: T): Promise<void> {
    const user = await this.afAuth.currentUser;
    return this.getCollection(user).doc(item.id).delete();
  }

  async update(item: T): Promise<void> {
    const user = await this.afAuth.currentUser;
    const data = { ...(item as object) } as T;
    delete data.id;
    return this.getCollection(user).doc(item.id).set(data);
  }

  abstract getCollection(user?: firebase.User): AngularFirestoreCollection<T>;
}
