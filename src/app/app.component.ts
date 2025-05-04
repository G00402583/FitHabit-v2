import { Component } from '@angular/core';
import { Platform, IonicModule } from '@ionic/angular';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {
  PushNotifications,
  Token,
  PushNotification,
  ActionPerformed
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.initPush();
    });
  }

  private initPush() {
    // 1) Request permission to use push notifications
    PushNotifications.requestPermissions()
      .then(result => {
        if (result.receive === 'granted') {
          // 2) Register with APNS/FCM
          PushNotifications.register();
        } else {
          console.warn('Push permission not granted:', result);
        }
      })
      .catch(err => console.error('Push permission error:', err));

    // 3) On success, you get a token
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration token:', token.value);
      alert(`FCM Token:\n${token.value}`);
    });

    // 4) Registration error
    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err);
    });

    // 5) Notification received while app is in foreground
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received:', notification);
        // e.g. show a local toast or update UI
      }
    );

    // 6) Notification action (user tapped it)
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('Push action performed:', action);
        // e.g. navigate to a specific page:
        // this.router.navigate(['/some-page', action.notification.data.someId]);
      }
    );
  }
}
