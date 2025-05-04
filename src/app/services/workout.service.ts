
// It defines a WorkoutService that connects to Firestore and supports loading and submitting workouts using Observables.

import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Workout {
  id?: string;
  userId: string;
  exercise: string;
  sets: number;
  reps: number;
  notes?: string;
  date: any;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  /**
   * Get workouts for the currently logged-in user as an Observable stream
   */
  getUserWorkouts(): Observable<Workout[]> {
    return new Observable<Workout[]>((observer) => {
      this.auth.getCurrentUser().then((user) => {
        if (!user) {
          observer.next([]);
          observer.complete();
          return;
        }

        const workoutsRef = collection(this.firestore, 'workouts');
        const q = query(
          workoutsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );

        const workouts$ = collectionData(q, { idField: 'id' }) as Observable<Workout[]>;
        workouts$.subscribe({
          next: (data) => observer.next(data),
          error: (err) => observer.error(err),
          complete: () => observer.complete()
        });
      });
    });
  }

  /**
   * Add a new workout for the logged-in user
   */
  addWorkout(workout: Partial<Workout>): Promise<void> {
    return this.auth.getCurrentUser().then(user => {
      if (!user) throw new Error('Not logged in');

      const ref = collection(this.firestore, 'workouts');
      return addDoc(ref, {
        ...workout,
        userId: user.uid,
        date: Timestamp.now()
      }).then(() => {});
    });
  }
}
