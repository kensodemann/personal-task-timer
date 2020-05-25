import { TestBed } from '@angular/core/testing';

import { ConversionService } from './conversion.service';
import { TimersService, CustomersService } from '../firestore-data';
import { createCustomersServiceMock, createTimersServiceMock } from '../firestore-data/mocks';
import { createAngularFirestoreDocumentMock, createAngularFirestoreCollectionMock } from '@test/mocks';

describe('ConversionService', () => {
  let collection;
  let document;
  let service: ConversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomersService, useFactory: createCustomersServiceMock },
        { provide: TimersService, useFactory: createTimersServiceMock }
      ]
    });
    service = TestBed.inject(ConversionService);

    document = createAngularFirestoreDocumentMock();
    collection = createAngularFirestoreCollectionMock();
    collection.doc.mockReturnValue(document);
    document.collection.mockReturnValue(collection);
    const ts = TestBed.inject(TimersService);
    (ts.getCollection as any).mockReturnValue(collection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
