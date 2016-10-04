import { Injectable } from '@angular/core';
import { Connectivity } from '../../providers/connectivity/connectivity';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { UrlConstant } from '../../providers/data/url-constant';

declare var google;

@Injectable()
export class Googlemap {
  Stops = new Array();
  Vehicles = new Array();
  forwardRoutePath: any;
  reverseRoutePath: any;

  latitude: number;
  longitude: number;
  defaultCenter: any = {
    lat: 13.764854683340484,
    lng: 100.53831338882446
  };

  stops: FirebaseListObservable<any[]>;
  vehicleSnapShot: FirebaseObjectObservable<any>;
  oldFirebaseBinded = null;

  zoom: any;
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string;
  enableCurrentLocation: boolean = false;

  constructor(public connectivityService: Connectivity, public af: AngularFire, private urlConstant: UrlConstant) {
    this.apiKey = this.urlConstant.gmapApiKey;
  }

  init(mapElement: any, pleaseConnect: any, zoom: any = 15): any {
    this.zoom = zoom;
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    this.mapLoaded = Observable.create(observer => {
      this.mapLoadedObserver = observer;
    });
    this.loadGoogleMaps();
    return this.mapLoaded;
  }

  loadGoogleMaps(): void {
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      console.log("Google maps JavaScript needs to be loaded.");

      this.disableMap();
      // if (this.connectivityService.isOnline()) {
        (<any>window).mapInit = () => {
          this.initMap();
          this.enableMap();
        }
        let script = document.createElement("script");
        script.id = "googleMaps";
        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey +
            '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      // }
    }
    else {
      // if (this.connectivityService.isOnline()) {
        this.initMap();
        this.enableMap();
      // }
      // else {
        // this.disableMap();
      // }
    }
    this.addConnectivityListeners();
  }

  initMap(): void {
    this.mapInitialised = true;
    var pos = {
      lat: 13.764854683340484,
      lng: 100.53831338882446
    };

    let latLng = new google.maps.LatLng(pos.lat, pos.lng);
    let mapOptions = {
      center: latLng,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement, mapOptions);
    // google.maps.event.addDomListener(window, 'resize', function() {
    //         var lastCenter = this.map.getCenter();
    //         google.maps.event.trigger(this.map, 'resize');
    //         this.map.setCenter(lastCenter);
    //     });


    this.mapLoadedObserver.next(true);

    // if (this.enableCurrentLocation) {
    //   Geolocation.getCurrentPosition().then((position) => {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     console.log('setMap Current Loc');
    //     this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    //   });
    // }
  }

  recenter(latitude = this.defaultCenter.lat, longitude = this.defaultCenter.lng) {
    let latLng = new google.maps.LatLng(latitude, longitude);
    this.map.setCenter(latLng);
  }

  disableMap(): void {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }
  }

  enableMap(): void {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }
  }

  addConnectivityListeners(): void {
    document.addEventListener('online', () => {
      console.log("online");
      setTimeout(() => {

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    }, false);
    document.addEventListener('offline', () => {
      console.log("offline");
      this.disableMap();
    }, false);

  }

  changeMarker(event): void {
    var icon = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }
    this.currentMarker = this.drawMarker(event, "", "", icon, false);
  }

  renderMap(companyId, routeId) {
    this.clearRoute();
    this.clearStops();
    this.clearAllVehicles();

    if (companyId) {
      if (routeId) {
        console.log("Case Company+Route");

        var vehiclesRef = this.af.database.list(this.urlConstant.bus + companyId + this.urlConstant.routes + routeId + this.urlConstant.vehicles);
        vehiclesRef.subscribe((vehicles) => {
          vehicles.forEach((vehicle) => {
            var vName = vehicle.$key;
            this.vehicleSnapShot = this.af.database.object(this.urlConstant.bus + companyId + this.urlConstant.vehicles + vName);
            this.vehicleSnapShot.subscribe((v) => {

              if (v.tripOn == true) {
                this.drawVehicle(v);
              } else {
                this.clearVehicle(v);
              }
            })
          }) //end vehicals
        })

        this.stops = this.af.database.list(this.urlConstant.bus + companyId + this.urlConstant.routes + routeId + this.urlConstant.routeStop, {
          query: {
            orderByChild: 'sortIndex'
          }
        });
        var arr = <any>[];
        this.stops.subscribe((stopArray) => arr = stopArray);
        this.stops.skip(arr.length).subscribe((stopArray) => {
          var paths = this.drawStops(stopArray, false, true, false);
          this.drawRoute(paths.reverse, false, '#FF0000');
          this.drawRoute(paths.forward, true, '#FF0000');
        });


      } else { //no route id
        console.log("Case Company No Route");
        //No route, get company buses
        var vehiclesRef = this.af.database.list(this.urlConstant.bus + companyId + this.urlConstant.vehicles);
        if (this.oldFirebaseBinded) {
          this.oldFirebaseBinded.off();
        }
        this.oldFirebaseBinded = vehiclesRef;
        vehiclesRef.subscribe((vehicles) => {
          vehicles.forEach((v) => {
            if (v.tripOn == true) {
              this.drawVehicle(v);
            }
            else {
              this.clearVehicle(v);
            }
          })
        })
      }
    } else { //no company Id
      console.log("Case No Company");
      var vehiclesRef = this.af.database.list(this.urlConstant.bus);
      if (this.oldFirebaseBinded) {
        this.oldFirebaseBinded.off();
        this.oldFirebaseBinded = vehiclesRef;
        vehiclesRef.subscribe((vehicles) => {
          vehicles.forEach((v) => {
            if (v.tripOn == true) {
              this.drawVehicle(v);
            }
            else {
              this.clearVehicle(v);
            }
          })
        })
      }
    }
  }


  drawVehicle(v) {
    if (!this.updateVehicle(v)) {
      var point = new google.maps.LatLng(v.lat, v.lon);
      var title = v.id;
      var name = v.id;
      var icon = "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=bus|bbT|" + v.id + "|fbff9b|000000";

      console.log('drawing');

      var newBus = this.drawMarker(point, title, v, icon, false);
      var infowindow = new google.maps.InfoWindow();
      newBus.addListener('click', function() {
        infowindow.setContent("<span style='color:black;'><b>Route</b> : " + newBus["name"].currentRoute +
          "<br><b>BusID</b> : " + newBus["name"].id +
          "<br><b>LastStop</b> : " + newBus["name"].currentStopName +
          "<br><b>Speed</b> : " + ((newBus["name"].speed * 60 * 60) / 1000).toFixed(2) +
          "<br><b>Passenger</b> : " + newBus["name"].passengers +
          "</span>");
      });

      this.Vehicles[v.id] = newBus;
    }

  }

  drawMarker(point, title, name, icon, draggable) {
    var marker = new google.maps.Marker({
      position: point,
      map: this.map,
      title: title,
      icon: icon,
      draggable: draggable
    });
    marker["name"] = name;
    return marker;
  }

  updateVehicle(v) {
    if (this.Vehicles[v.id]) {
      var oldBus = this.Vehicles[v.id];
      var point = new google.maps.LatLng(v.lat, v.lon);
      oldBus.setPosition(point);
      oldBus.name = v;
      oldBus.setMap(this.map);
      return true;
    }
    return false;
  }

  clearVehicle(v) {
    //Remove Old marker
    if (this.Vehicles[v.id]) {
      var oldBus = this.Vehicles[v.id];
      if (oldBus.getMap()) {
        oldBus.setMap(null);
      }
    }
  }

  drawRoute(paths, forward, color) {
    var pathColor;
    if (forward == true) {
      pathColor = "#FF0000";
      // Clear route and marker
      if (this.forwardRoutePath) {
        this.forwardRoutePath.setMap(null);
      }
    }
    else {
      pathColor = "#3bff00";
      if (this.reverseRoutePath) {
        this.reverseRoutePath.setMap(null);
      }
    }

    if (color) {
      pathColor = color;
    }

    var busRoutePath = new google.maps.Polyline({
      path: paths,
      geodesic: true,
      strokeColor: pathColor,
      strokeOpacity: 0.7,
      strokeWeight: 4,
    });

    busRoutePath.setMap(this.map);

    if (forward == true) {
      this.forwardRoutePath = busRoutePath;
    } else {
      this.reverseRoutePath = busRoutePath;
    }
  }

  drawStops(stopArray, drawPathSymbol, drawInfoWindows, separateDirection) {
    var forward = new Array();
    var reverse = new Array();
    var icon;

    this.clearStops();

    stopArray.forEach((stop) => {
      var point = new google.maps.LatLng(stop.lat, stop.lon);
      if (stop.type == "stop") {
        if (separateDirection) {
          if (stop.direction == "forward") {
            icon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
          }
          else if (stop.direction == "reverse") {
            icon = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
          }
          else {
            icon = 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
          }
        } else {
          //This case is draw on main map
          var scaleTo = 24;
          icon = {
            url: '../img/bus_stop_on.png',
            // Original size
            size: new google.maps.Size(64, 64),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(scaleTo, scaleTo),
            // The anchor for this image is the center of scaledSize
            anchor: new google.maps.Point(scaleTo / 2, scaleTo / 2),
          };
        }
      } else {
        icon = {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 3,
        }
      }

      if (stop.direction == "forward" || stop.direction == "both") {
        forward.push(point);
      }

      if (stop.direction == "reverse" || stop.direction == "both") {
        reverse.push(point);
      }


      if (stop.type == "path" && drawPathSymbol == false) {
        return;
      }

      var marker = this.drawMarker(point, stop.id, stop.name, icon, false);

      if (drawInfoWindows) {
        var opt = {
          pixelOffset: new google.maps.Size(-scaleTo + 3, scaleTo / 2),
        };
        var infowindow = new google.maps.InfoWindow(opt);
        marker.addListener('click', function() {
          infowindow.setContent("<span style='color:black;'>" + marker.title + ' - ' + marker.name + "</span>");
          infowindow.open(this.map, marker);
        });
      }
      this.Stops.push(marker);
    });

    return { "forward": forward, "reverse": reverse };
  }

  clearStops() {
    //Clear Old Stop Markers
    if (this.Stops) {
      this.Stops.forEach((marker, index) => {
        marker.setMap(null);
      });
      this.Stops = [];
    }
    else {
      this.Stops = new Array();
    }
  }

  clearRoute() {
    if (this.forwardRoutePath) {
      this.forwardRoutePath.setMap(null);
    }
    if (this.reverseRoutePath) {
      this.reverseRoutePath.setMap(null);
    }
  }

  clearAllVehicles() {
    this.Vehicles.forEach((vehicle) => {
      vehicle.setMap(null);
    })
  }


}
