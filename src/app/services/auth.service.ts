
// It defines the AuthService for handling authentication in FitHabit using AngularFire.
// ✅ Uses safe constructor-based injection for Auth to avoid injection errors.

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  updateProfile,
  sendPasswordResetEmail,
  User
} from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  /**
   * Register a new user with email & password
   */
  register(email: string, password: string): Promise<unknown> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Sign in an existing user
   */
  login(email: string, password: string): Promise<unknown> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Sign out the current user and navigate to the login page
   */
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  /**
   * Observable of the authentication state: emits the User object or null
   */
  getAuthState(): Observable<User | null> {
    return authState(this.auth);
  }

  /**
   * Returns a Promise that resolves once to the current User, or null
   */
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      authState(this.auth).pipe(take(1)).subscribe({
        next: user => resolve(user ?? null),
        error: err => reject(err)
      });
    });
  }

  /**
   * Update the current user's display name
   */
  async updateDisplayName(name: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (user) {
      await updateProfile(user, { displayName: name });
    }
  }

  /**
   * Get the current user's display name
   */
  async getDisplayName(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.displayName || null;
  }

  /**
   * Send a password reset email
   */
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
}
