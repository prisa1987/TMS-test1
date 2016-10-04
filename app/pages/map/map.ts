import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Network } from 'ionic-native';
import { Geolocation } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Googlemap } from '../../providers/googlemap/googlemap';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

declare var google;

@Component({
	templateUrl: 'build/pages/map/map.html',
	pipes: [TranslatePipe]
})
export class MapPage {

	@ViewChild('map') mapElement: ElementRef;
	@ViewChild('pleaseConnect') pleaseConnect: ElementRef;

	latitude: number;
	longitude: number;
	mssap = null;
	isRecenter = true;
	companyId: any;
	routeId: any;

  	 constructor(public nav: NavController, public gmap: Googlemap,
		public platform: Platform, private view: ViewController, private params: NavParams) {
		this.companyId = this.params.get("companyId");
		this.routeId = this.params.get("routeId");
	}

	ngAfterViewInit(): void {
		var mapLoaded = this.gmap.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
		mapLoaded.subscribe(update => {
			this.resizeMapListener();
		});

		if (this.gmap.currentMarker) {
			this.gmap.currentMarker.setMap(null);
		}
		this.gmap.renderMap(this.companyId, this.routeId);
	}

	resizeMapListener() {
		google.maps.event.addListener(this.gmap.map, "idle", (event) => {
			if (this.isRecenter) {
				google.maps.event.trigger(this.gmap.map, 'resize');
				this.gmap.recenter();
			}
		});

		google.maps.event.addListener(this.gmap.map, "dragend", (event) => {
			this.isRecenter = false;
		});

		google.maps.event.addListener(this.gmap.map, "zoom_changed", (event) => {
			this.isRecenter = false;
		});

	}

}
