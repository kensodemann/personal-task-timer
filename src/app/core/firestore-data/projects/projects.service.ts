import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Project } from '@app/models';
import firebase from 'firebase/app';
import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService extends FirestoreDataService<Project> {
  constructor(private ngFirestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  getCollection(user: firebase.User): AngularFirestoreCollection<Project> {
    return this.ngFirestore
      .collection('users')
      .doc((user && user.uid) || 'unknown')
      .collection('projects');
  }
}
