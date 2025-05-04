
// It refactors workout-history.page.ts to use the WorkoutService for loading workouts from Firebase.
// It also adds a console log and expects (ionSelect) instead of (click) to fix swipe-to-delete behavior.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { WorkoutService, Workout } from '../services/workout.service';
import { Firestore, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './workout-history.page.html',
  styleUrls: ['./workout-history.page.scss'],
})
export class WorkoutHistoryPage {
  workouts$!: Observable<Workout[]>;
  editingId: string | null = null;
  editWorkout: Partial<Workout> = {};

  constructor(
    private workoutService: WorkoutService,
    private fs: Firestore,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.loadWorkouts();
  }

  loadWorkouts() {
    this.workouts$ = this.workoutService.getUserWorkouts();
  }

  startEdit(w: Workout) {
    this.editingId = w.id!;
    this.editWorkout = {
      exercise: w.exercise,
      sets: w.sets,
      reps: w.reps,
      notes: w.notes
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.editWorkout = {};
  }

  async saveEdit(id: string) {
    const ref = doc(this.fs, `workouts/${id}`);
    await updateDoc(ref, {
      exercise: this.editWorkout.exercise,
      sets: this.editWorkout.sets,
      reps: this.editWorkout.reps,
      notes: this.editWorkout.notes
    });

    const toast = await this.toastCtrl.create({
      message: 'Workout updated ✅',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.cancelEdit();
    this.loadWorkouts();
  }

  async deleteWorkout(id: string) {
    console.log('🗑️ Deleting workout with ID:', id); 

    const confirmed = confirm('Are you sure you want to delete this workout?');
    if (!confirmed) return;

    const ref = doc(this.fs, `workouts/${id}`);
    await deleteDoc(ref);

    const toast = await this.toastCtrl.create({
      message: 'Workout deleted 🗑️',
      duration: 1500,
      color: 'danger'
    });
    await toast.present();

    this.loadWorkouts();
  }
}
