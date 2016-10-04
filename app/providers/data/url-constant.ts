import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UrlConstant {
	clientIdForLogin = "572846415732-o5265hv6jlbhe5sqonldqei979t62rc0.apps.googleusercontent.com";
    gmapApiKey = "AIzaSyC0WlHQjP5NumSuKNL3crJw5rkld9ooLVg";
	static apiKey = "AIzaSyCM7cAcxh-qdUQ-OPlgvJQ7D-I4dcRtLnc";
	static authDomain = "pia-tms.firebaseapp.com";
	static databaseURL = "https://pia-tms.firebaseio.com";
	static storageBucket = "";
	bus = "/Thai_Private_Test/";
	fares = "/fares/";
	routes = "/routes/";
	trips = "/trips/";
	vehicles = "/vehicles/";
	routeStop = "/routeStop/";
	transactions = "/transactions/";
}

