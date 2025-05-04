/*****************************************************************
 * FitHabit – Log Habit Page 
 *****************************************************************/
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log-habit',
  standalone: true,
  templateUrl: './log-habit.page.html',
  styleUrls: ['./log-habit.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogHabitPage {
  habit = '';
  completed = false;
  notes = '';
  habitsToday$: Observable<any[]> | null = null;

  redoMode = false;
  editMode = false;
  targetHabitId: string | null = null;

  constructor(
    private fs: Firestore,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.loadUserHabits();
  }

  async loadUserHabits() {
    const user = await this.auth.getCurrentUser();
    if (!user) return;

    const habitsCol = collection(this.fs, 'habits');
    const q = query(
      habitsCol,
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    this.habitsToday$ = collectionData(q, { idField: 'id' });
  }

  async logHabit() {
    const user = await this.auth.getCurrentUser();
    if (!user) return;

    if (this.editMode && this.targetHabitId) {
      const habitRef = doc(this.fs, `habits/${this.targetHabitId}`);
      await updateDoc(habitRef, {
        habit: this.habit,
        completed: this.completed,
        notes: this.notes
      });

      const toast = await this.toastCtrl.create({
        message: 'Habit updated ✏️',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    } else {
      const habitsCol = collection(this.fs, 'habits');
      await addDoc(habitsCol, {
        habit: this.habit,
        completed: this.completed,
        notes: this.notes,
        date: new Date(),
        userId: user.uid
      });

      const toast = await this.toastCtrl.create({
        message: this.redoMode ? 'Habit redone 🔁' : 'Habit logged ✅',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    }

    this.habit = '';
    this.completed = false;
    this.notes = '';
    this.redoMode = false;
    this.editMode = false;
    this.targetHabitId = null;

    this.loadUserHabits();
  }

  async markAsCompleted(habitId: string) {
    const habitRef = doc(this.fs, `habits/${habitId}`);
    await updateDoc(habitRef, { completed: true });

    const toast = await this.toastCtrl.create({
      message: 'Habit marked complete 🎯',
      duration: 1500,
      color: 'success'
    });
    await toast.present();

    this.loadUserHabits();
  }

  redo(habit: any) {
    this.habit = habit.habit;
    this.notes = habit.notes || '';
    this.completed = false;
    this.redoMode = true;
    this.editMode = false;
    this.targetHabitId = null;
  }

  edit(habit: any) {
    this.habit = habit.habit;
    this.notes = habit.notes || '';
    this.completed = habit.completed || false;
    this.editMode = true;
    this.redoMode = false;
    this.targetHabitId = habit.id;
  }

  async delete(habitId: string) {
    const confirmed = confirm('Are you sure you want to delete this habit?');
    if (!confirmed) return;

    const habitRef = doc(this.fs, `habits/${habitId}`);
    await deleteDoc(habitRef);

    const toast = await this.toastCtrl.create({
      message: 'Habit deleted 🗑️',
      duration: 1500,
      color: 'danger'
    });
    await toast.present();

    this.loadUserHabits();
  }
}
