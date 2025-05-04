
// It uses the WorkoutService to log a new workout into Firestore for the current user.


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-track-workout',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './track-workout.page.html',
  styleUrls: ['./track-workout.page.scss'],
})
export class TrackWorkoutPage {
  exercise = '';
  sets: number | null = null;
  reps: number | null = null;
  notes = '';

  constructor(
    private workoutService: WorkoutService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async saveWorkout() {
    try {
      if (!this.exercise || !this.sets || !this.reps) {
        const toast = await this.toastCtrl.create({
          message: 'Please fill out all required fields!',
          duration: 2000,
          color: 'warning',
          position: 'bottom' 
        });
        await toast.present();
        return;
      }

      await this.workoutService.addWorkout({
        exercise: this.exercise,
        sets: this.sets,
        reps: this.reps,
        notes: this.notes
      });

      const toast = await this.toastCtrl.create({
        message: 'Workout saved ✅',
        duration: 2000,
        color: 'success',
        position: 'bottom' 
      });
      await toast.present();

      // Reset form
      this.exercise = '';
      this.sets = this.reps = null;
      this.notes = '';

      this.router.navigate(['/home']);
    } catch (e) {
      console.error('Workout save failed:', e);
      const errToast = await this.toastCtrl.create({
        message: 'Failed to save workout',
        duration: 2000,
        color: 'danger',
        position: 'bottom' 
      });
      await errToast.present();
    }
  }
}
