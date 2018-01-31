import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/filter';

import { HTTPProvider } from '../../providers/http/http';

import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  posts = [];

  lat: number;
  lon: number;

  constructor(public navCtrl: NavController,
              private geolocation: Geolocation,
              private platform: Platform,
              private alertController: AlertController,
              private httpProvider: HTTPProvider,
              private androidPermissions: AndroidPermissions) {


              this.get_posts();

              this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                result => console.log('Has permission?', result.hasPermission),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
              );
              this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                result => console.log('Has permission?', result.hasPermission),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
);
              


  }

  ionViewDidLoad(){
    console.log('did load')


    // this.platform.ready().then(() => {
      // this.watch_position();
      // this.set_interval();
    // });

  }

  async get_current_position(){

    try{
      let data = await this.geolocation.getCurrentPosition({maximumAge: 0 , timeout: 5 * 1000 });
      console.log(JSON.stringify(data))

      if(data.coords !== undefined){
        this.lat = data.coords.latitude;
        this.lon = data.coords.longitude;
      }else{
        this.presentAlert('Error!', 'Asegúrese que su GPS esté activo');
      };

      this.watch_position();

    }catch(error){

      if(error.message.indexOf('Timeout') != -1){
        this.presentAlert('Error!', 'Asegúrese que su GPS esté activo');
      }else{
        this.presentAlert('Error!', `Code: ${error.Code} message: ${error.message}`);
      };

    };

  }

  watch_position(){
    let watch = this.geolocation.watchPosition({maximumAge: 0 ,timeout: 20 * 1000 });
    watch
      .subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        console.log(`Got new GPS location: ${data}`);
        this.presentAlert('GPS', `${data.coords.latitude} ${data.coords.longitude}`);
        // data.coords.longitude
      },
      (error) => {
        if(error.message.indexOf('Timeout') != -1){
          this.presentAlert('Error!', 'Asegúrese que su GPS esté activo');
        }else{
          this.presentAlert('Error!', `Code: ${error.Code} message: ${error.message}`);
        };
      });
  }

  set_interval(){
    setInterval( async (data) => {
      console.log('Inside interval. Calling get_posts()')
      this.get_posts();
      this.get_current_position();
    }, 5 * 1000);
  }

  presentAlert(title: string, msg: string) {
    let alert = this.alertController.create({
      title: title,
      message: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  get_posts(){
    
    console.log('Calling get_posts()');

    this.httpProvider.get_posts().subscribe(
      (data) => {
        let posts = data.slice(0,10);

        let random_num = Math.floor(Math.random() * 10);

        console.log(random_num)
        
        posts.splice(random_num, 1);

        this.posts = posts;
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
