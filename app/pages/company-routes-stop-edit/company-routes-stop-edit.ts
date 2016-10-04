import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { Googlemap } from '../../providers/googlemap/googlemap';
import { Geolocation } from 'ionic-native';
import { Network } from 'ionic-native';
import { CompanyRoutesStopPage } from '../../pages/company-routes-stop/company-routes-stop';
import { CompanyRoutesSelectPage } from '../../pages/company-routes-select/company-routes-select'; 
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

declare var google;

@Component({
	templateUrl: 'build/pages/company-routes-stop-edit/company-routes-stop-edit.html',
	pipes: [TranslatePipe]
})
export class CompanyRoutesStopEditPage {

	stopId: string;
	stopName: string;
	fareStopTag: any;
	direction: string;
	type: string;
	longitude: number;
	latitude: number;

	currentStop: any;
	stops: Observable<any>;
	companyKey: string;
	routeId: string;

	isRecenter = true;
	latArray: Observable<any>;
	lonArray: Observable<any>;

	@ViewChild('mapStop') mapElement: ElementRef;
	@ViewChild('pleaseConnect') pleaseConnect: ElementRef;

	constructor(private nav: NavController, private af: AngularFire, private gmap: Googlemap,
	 private params: NavParams, private urlConstant: UrlConstant) {
		this.companyKey = params.get('companyKey');
		this.routeId = params.get('routeId');

		this.currentStop = params.get('stop');
		this.stopId = this.currentStop.id;
		this.stopName = this.currentStop.name;
		this.direction = this.currentStop.direction;
		this.type = this.currentStop.type;
		this.longitude = this.currentStop.lon;
		this.latitude = this.currentStop.lat;
	}

	requestStops() {
		this.stops = this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes + this.routeId + "/routeStop", {
			query: {
				orderByChild: 'sortIndex'
			}
		});
		var arr = <any>[];
        this.stops.subscribe((stopArray) => arr = stopArray);
        this.stops.skip(arr.length).subscribe((stopArray) => {
			length = stopArray.length;
			var paths = this.gmap.drawStops(stopArray, true, true, true);
			this.gmap.drawRoute(paths.reverse, false, '#FF0000');
			this.gmap.drawRoute(paths.forward, true, '#FF0000');
		      });
	}

	ngAfterViewInit(): void {
		var mapLoaded = this.gmap.init(this.mapElement.nativeElement,
			this.pleaseConnect.nativeElement, 17);
		mapLoaded.subscribe(update => {
		});

		this.setBusStopListener();
		this.resizeMapListener();
		this.requestStops();
	}


	resizeMapListener() {
		google.maps.event.addListener(this.gmap.map, "idle", (event) => {
			if (this.isRecenter) {
				google.maps.event.trigger(this.gmap.map, 'resize');
				this.gmap.recenter(this.latitude, this.longitude);
				var map = new google.maps.LatLng(this.latitude, this.longitude);
				this.gmap.changeMarker(map);
			}
		});

		google.maps.event.addListener(this.gmap.map, "dragend", (event) => {
			this.isRecenter = false;
		});

		google.maps.event.addListener(this.gmap.map, "zoom_changed", (event) => {
			this.isRecenter = false;
		});
	}

	setBusStopListener() {
		google.maps.event.addListener(this.gmap.map, "idle", (event) => {
			google.maps.event.trigger(this.gmap.map, 'resize');
		});
		google.maps.event.addListener(this.gmap.map, "click", (event) => {
			this.latitude = event.latLng.lat();
			this.longitude = event.latLng.lng();
			var map = new google.maps.LatLng(this.latitude, this.longitude);
			this.gmap.changeMarker(map);
		});
	}

	editBusStop() {
		this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes + this.routeId + this.urlConstant.routeStop).update(this.currentStop.$key, {
			"id": this.stopId,
			"name": this.stopName,
			"direction": this.direction,
			"type": this.type,
			"lat": this.latitude,
			"lon": this.longitude
		})
		this.requestStops();
	}

	back() {
		this.nav.setRoot(CompanyRoutesStopPage,  {
			companyKey: this.companyKey,
			routeId: this.routeId,
		});
	}

}
