import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { FIREBASE_PROVIDERS, defaultFirebase, AngularFire, FirebaseListObservable } from 'angularfire2';
import { Connectivity } from './providers/connectivity/connectivity';
import { Data } from './providers/data/data';
import { LoginPage } from './pages/login/login';
import { MapPage } from './pages/map/map';
import { CompanyPage } from './pages/company/company';
import { CompanyRoutesPage } from './pages/company-routes/company-routes';
import { Googlemap } from './providers/googlemap/googlemap';
import { CompanyRoutePipe } from './pipes/CompanyRoutePipe';
import { RevenueReportPage } from './pages/revenue-report/revenue-report';
import { UrlConstant } from './providers/data/url-constant';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { SettingPage } from './pages/setting/setting';

@Component({
  templateUrl: 'build/app.html',
  providers: [
    Googlemap,
    FIREBASE_PROVIDERS,
    UrlConstant,
    // Initialize Firebase app  
    defaultFirebase({
      apiKey: UrlConstant.apiKey,
      authDomain: UrlConstant.authDomain,
      databaseURL: UrlConstant.databaseURL,
      storageBucket: "",
    }
    ),
    {
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
      deps: [Http]
    },
    TranslateService
  ],
  pipes: [CompanyRoutePipe, TranslatePipe]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  mapPage: any = MapPage;
  companyPage: any = CompanyPage;
  companyRoutesPage: any = CompanyRoutesPage;
  revenueReportPage: any = RevenueReportPage;
  settingPage: any = SettingPage;
  shownGroup: any = null;
  companies: FirebaseListObservable<any[]>


  constructor(platform: Platform, public menu: MenuController, public af: AngularFire, public dataService: Data,
    public translate: TranslateService, public gmap: Googlemap, private urlConstant: UrlConstant) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

    });

    this.translateConfig();
    this.companies = this.af.database.list(this.urlConstant.bus);
  }

  showMap(companyId, routeId) {
    if (routeId != null) {
      this.menu.close();
    }

    if (this.dataService.currentPage == this.mapPage) {
      this.gmap.renderMap(companyId, routeId);
    } else {
      this.dataService.currentPage = this.mapPage;
      this.nav.setRoot(this.mapPage, {
        companyId: companyId,
        routeId: routeId
      });
    }
  }

  toggleGroup(group) {
    // console.log("--> " + this.isGroupShown(group));
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  openPage(page): void {
    this.menu.close();
    this.nav.setRoot(page);
    this.dataService.currentPage = page;
  }

  logout(): void {
    this.dataService.photo = null;
    this.dataService.profileName = null;

    this.menu.close();
    this.menu.enable(false);
    this.af.auth.logout();
    this.nav.setRoot(LoginPage);
  }

  translateConfig() {
    var userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(en|th)/gi.test(userLang) ? userLang : 'en';

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(userLang);
  }


}

ionicBootstrap(MyApp, [Data, Connectivity, Googlemap]);

