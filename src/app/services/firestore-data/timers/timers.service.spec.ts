import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { TimersService } from './timers.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFireAuthMock,
  createAngularFirestoreDocumentMock
} from '@test/mocks';
import { AngularFireAuth } from '@angular/fire/auth';

describe('TimersService', () => {
  let collection;
  let doc;
  let timers: TimersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock }
      ]
    });
    const angularFirestore = TestBed.get(AngularFirestore);
    doc = createAngularFirestoreDocumentMock();
    collection = createAngularFirestoreCollectionMock();
    collection.doc.mockReturnValue(doc);
    doc.collection.mockReturnValue(collection);
    angularFirestore.collection.mockReturnValue(collection);
  });

  beforeEach(inject([TimersService], (service: TimersService) => {
    timers = service;
    const afAuth = TestBed.get(AngularFireAuth);
    afAuth.auth.currentUser = { uid: '123abc' };
    afAuth.authState.next();
  }));

  it('should be created', () => {
    expect(timers).toBeTruthy();
  });

  it('grabs a references to the exercises collection', () => {
    const angularFirestore = TestBed.get(AngularFirestore);
    timers.observeChanges();
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('users');
    expect(collection.doc).toHaveBeenCalledTimes(1);
    expect(collection.doc).toHaveBeenCalledWith('123abc');
    expect(doc.collection).toHaveBeenCalledTimes(1);
    expect(doc.collection).toHaveBeenCalledWith('timers');
  });
});
