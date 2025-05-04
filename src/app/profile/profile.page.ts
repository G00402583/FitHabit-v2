/*****************************************************************
 * FitHabit – Profile Page
 *****************************************************************/
import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage {
  user: User | null = null;
  displayName = '';
  darkMode = false;
  bio = '';
  goal = '';

  constructor(
    private auth: AuthService,
    private toastCtrl: ToastController,
    private router: Router,
    private fs: Firestore
  ) {
    this.loadUser();
  }

  async loadUser() {
    this.user = await this.auth.getCurrentUser();
    this.displayName = this.user?.displayName || '';
    this.darkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
    document.body.classList.toggle('dark', this.darkMode);

    if (this.user) {
      const ref = doc(this.fs, 'profiles', this.user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data: any = snap.data();
        this.bio = data.bio || '';
        this.goal = data.goal || '';
      }
    }
  }

  async updateProfile() {
    if (this.user) {
      await this.auth.updateDisplayName(this.displayName);

      const ref = doc(this.fs, 'profiles', this.user.uid);
      await setDoc(ref, {
        bio: this.bio,
        goal: this.goal
      }, { merge: true });

      const toast = await this.toastCtrl.create({
        message: 'Profile updated 🎯',
        duration: 1500,
        color: 'success'
      });
      toast.present();
    }
  }

  toggleDarkMode() {
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    document.body.classList.toggle('dark', this.darkMode);
  }

  async resetPassword() {
    if (!this.user?.email) return;
    await this.auth.resetPassword(this.user.email);

    const toast = await this.toastCtrl.create({
      message: 'Password reset email sent ✉️',
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
