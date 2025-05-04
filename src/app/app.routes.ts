import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';   //  match the class name that’s exported

export const routes: Routes = [
  // 🔄 Redirect root to /home ddd
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // 🏠 Home
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },

  // 🏋️ Track Workout – protected
  {
    path: 'track-workout',
    loadComponent: () =>
      import('./track-workout/track-workout.page').then(
        (m) => m.TrackWorkoutPage
      ),
    canActivate: [AuthGuard],
  },

  // 📋 Workout History – protected
  {
    path: 'workout-history',
    loadComponent: () =>
      import('./workout-history/workout-history.page').then(
        (m) => m.WorkoutHistoryPage
      ),
    canActivate: [AuthGuard],
  },

  // 🔐 Login
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
  },

  // 🆕 Register
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
  },

  // 📝 Log Habit – protected
  {
    path: 'log-habit',
    loadComponent: () =>
      import('./log-habit/log-habit.page').then((m) => m.LogHabitPage),
    canActivate: [AuthGuard],
  },

  // 🙍‍♂️ Profile – protected
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.page').then((m) => m.ProfilePage),
    canActivate: [AuthGuard],
  },

  // 🚫 Catch‑all fallback — MUST stay last
  {
    path: '**',
    redirectTo: 'home',
  },
];
