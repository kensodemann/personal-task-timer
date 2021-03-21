import { TestBed, inject } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';

import { CustomersService } from './customers.service';
import {
  createAngularFireAuthMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
} from '@test/mocks';

describe('CustomersService', () => {
  let customers: CustomersService;
  let collection: any;
  let document: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock },
      ],
    });
    const angularFirestore = TestBed.inject(AngularFirestore);
    document = createAngularFirestoreDocumentMock();
    collection = createAngularFirestoreCollectionMock();
    collection.doc.mockReturnValue(document);
    document.collection.mockReturnValue(collection);
    (angularFirestore.collection as any).mockReturnValue(collection);
    customers = TestBed.inject(CustomersService);
  });

  beforeEach(inject([CustomersService], (service: CustomersService) => {
    customers = service;
    const afAuth = TestBed.inject(AngularFireAuth);
    (afAuth as any).currentUser = Promise.resolve({ uid: '123abc' });
    (afAuth as any).user = of({ uid: '123abc' });
    (afAuth.authState as any).next();
  }));

  it('should be created', () => {
    expect(customers).toBeTruthy();
  });

  it('grabs a references to the customers collection', () => {
    const angularFirestore = TestBed.inject(AngularFirestore);
    customers.observeChanges().subscribe();
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('users');
    expect(collection.doc).toHaveBeenCalledTimes(1);
    expect(collection.doc).toHaveBeenCalledWith('123abc');
    expect(document.collection).toHaveBeenCalledTimes(1);
    expect(document.collection).toHaveBeenCalledWith('customers');
  });

  describe('convert customers', () => {
    it('grabs a references to the customers collection', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      customers.convertCustomers();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(document.collection).toHaveBeenCalledTimes(1);
      expect(document.collection).toHaveBeenCalledWith('customers');
    });
  });
});
