import { AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

export abstract class FirestoreDataService<T extends { id?: string }> {
  get collection(): AngularFirestoreCollection<T> {
    return this.getCollection();
  }

  constructor() {}

  observeChanges(): Observable<Array<DocumentChangeAction<T>>> {
    return this.collection.stateChanges();
  }

  async get(id: string): Promise<T> {
    const doc = await this.collection.doc<T>(id).ref.get();
    return { id, ...(doc && doc.data()) } as T;
  }

  add(item: T): Promise<DocumentReference> {
    return this.collection.add(item);
  }

  delete(item: T): Promise<void> {
    return this.collection.doc(item.id).delete();
  }

  update(item: T): Promise<void> {
    const data = { ...(item as object) } as T;
    delete data.id;
    return this.collection.doc(item.id).set(data);
  }

  protected abstract getCollection(): AngularFirestoreCollection<T>;
}
