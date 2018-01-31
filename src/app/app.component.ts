import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AlertController } from 'ionic-angular';

import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private alertController: AlertController,
    private fcm: FCM) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


    console.log('Getting FCM token');
      
    this.fcm.getToken().then((token) => {

      console.log(`Obtained FCM token: ${token}`);
      // this.presentAlert('FCM token', token);
      }, error => {
        console.error(`Error: ${error}`);
      });

      this.fcm.onTokenRefresh().subscribe((token) => {
        console.log(`Obtained FCM token: ${token}`);
        // this.presentAlert('FCM token', token);
        }, error => {
          console.error(`Error: ${error}`);
        });

      this.fcm.onNotification().subscribe( (data) => {
        console.log(JSON.stringify(data));
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");

          if(data.hasOwnProperty('message')){
            this.presentAlert('Push notification', data['message']);
          };

        };
      });

    });
  }

  presentAlert(title: string, msg: string) {
    let alert = this.alertController.create({
      title: title,
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }


}