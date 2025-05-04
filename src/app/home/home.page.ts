import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    NgIf,
    RouterModule
  ],
})
export class HomePage implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  userEmail: string | null = null;
  darkMode = false;
  fcmToken: string | null = null;  // ← new

  constructor() {
    //  Set initial theme from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    this.darkMode = savedTheme === 'true';
    document.body.classList.toggle('dark', this.darkMode);

    this.authService.getAuthState().subscribe((user) => {
      this.userEmail = user?.email ?? null;
    });
  }

  ngOnInit() {
    // Read the token the AppComponent stored in localStorage
    this.fcmToken = localStorage.getItem('fcmToken');
  }

  logout() {
    this.authService.logout();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  //  Toggles and persists theme
  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('darkMode', this.darkMode.toString());
  }
}
