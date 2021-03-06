import { inject, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

import { TimersService } from './timers.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFireAuthMock,
  createAngularFirestoreDocumentMock,
  createDocumentSnapshotMock,
} from '@test/mocks';
import { AngularFireAuth } from '@angular/fire/auth';

describe('TimersService', () => {
  let collection;
  let document;
  let timers: TimersService;

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
  });

  beforeEach(inject([TimersService], (service: TimersService) => {
    timers = service;
    const afAuth = TestBed.inject(AngularFireAuth);
    (afAuth as any).currentUser = Promise.resolve({ uid: '123abc' });
    (afAuth as any).user = of({ uid: '123abc' });
    (afAuth.authState as any).next();
  }));

  it('should be created', () => {
    expect(timers).toBeTruthy();
  });

  it('grabs a references to the timers collection', () => {
    const angularFirestore = TestBed.inject(AngularFirestore);
    timers.observeChanges().subscribe();
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('users');
    expect(collection.doc).toHaveBeenCalledTimes(1);
    expect(collection.doc).toHaveBeenCalledWith('123abc');
    expect(document.collection).toHaveBeenCalledTimes(1);
    expect(document.collection).toHaveBeenCalledWith('timers');
  });

  describe('start', () => {
    it('gets a reference to the document', async () => {
      await timers.start('49950399KT');
      expect(collection.doc).toHaveBeenCalledTimes(2);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('updates the document with the current time', async () => {
      Date.now = jest.fn(() => 1577102400000);
      await timers.start('49950399KT');
      expect(document.update).toHaveBeenCalledTimes(1);
      expect(document.update).toHaveBeenCalledWith({
        startTime: 1577102400000,
      });
      (Date.now as any).mockRestore();
    });
  });

  describe('stop', () => {
    beforeEach(() => {
      const snapshot = createDocumentSnapshotMock();
      snapshot.data.mockReturnValue({
        id: '49950399KT',
        title: 'Uhg, this is so ugly',
        customer: 'Ace Hardware',
        type: 'Code Review',
        task: '#22950',
        minutes: 27,
        startTime: 1577102400000,
        date: '2019-12-23',
      });
      document.ref.get.mockResolvedValue(snapshot);
    });

    it('gets a reference to the document', async () => {
      await timers.stop('49950399KT');
      expect(collection.doc).toHaveBeenCalledTimes(2);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(collection.doc).toHaveBeenCalledWith('49950399KT');
    });

    it('updates the minutes and clears the start time', async () => {
      Date.now = jest.fn(() => 1577103480000);
      await timers.stop('49950399KT');
      expect(document.update).toHaveBeenCalledTimes(1);
      expect(document.update).toHaveBeenCalledWith({
        startTime: null,
        minutes: 45,
      });
    });
  });
});
