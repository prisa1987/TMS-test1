import { Component } from '@angular/core';
import { Platform, NavController, MenuController, Alert, Loading } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods, FIREBASE_PROVIDERS } from 'angularfire2';
import { MapPage } from '../map/map';
import { Data } from '../../providers/data/data';
import { CordovaOauth, Google } from 'ng2-cordova-oauth/core';
import { UrlConstant } from '../../providers/data/url-constant';
import { GooglePlus } from 'ionic-native';
import { InAppBrowser } from 'ionic-native';


declare let firebase: any;

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  cordovaOauth: any
  profile: any

  constructor(public af: AngularFire, private nav: NavController, private menu:
    MenuController,private dataService: Data, private platform: Platform, private urlConstant: UrlConstant) {

    this.cordovaOauth = new CordovaOauth(new Google({
      clientId: this.urlConstant.clientIdForLogin,
      appScope: ["email"],
      redirectUri: 'https://tms-bus.firebaseapp.com/__/auth/handler'
    }));

  }

  loginWithGoogle(): void {
      this.af.auth.login({
        provider: AuthProviders.Google,
        method: AuthMethods.Popup,
      }).then((value) => {
        this.dataService.profileName = value.auth.email;
        this.dataService.photo = "http://4.bp.blogspot.com/-66_g-dtnSCU/Uf-jcezGjZI/AAAAAAAAnEU/kgZCLXFuoNY/s1600/image.png";
        this.dataService.email = value.auth.email;

        if (value.auth.displayName) {
          this.dataService.profileName = value.auth.displayName;
        }

        if (value.auth.photoURL) {
          this.dataService.photo = value.auth.photoURL;
        }

        this.dataService.currentPage = MapPage;
        this.nav.setRoot(MapPage);
        this.menu.enable(true);
      }).catch((error) => {
        console.log(error);
         this.loginViaMobile();
      });
  }

  loginViaMobile() {
     this.cordovaOauth.login()
        .then((success) => {
          var provider = firebase.auth.GoogleAuthProvider.credential("", success.access_token);
          firebase.auth().signInWithCredential(provider)
            .then((success) => {
              this.profile = success.providerData[0];
              this.dataService.profileName = this.profile.displayName;
              this.dataService.photo = this.profile.photoURL;
              this.menu.enable(true);
              this.nav.setRoot(MapPage);
              console.log("Firebase success: " + success.providerData[0].displayName);
            })
            .catch((error) => {
              console.log("Firebase failure: " + JSON.stringify(error));
            });
        })
  }

}
