import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyRoutesStopAddPage } from '../../pages/company-routes-stop-add/company-routes-stop-add';
import { CompanyRoutesStopEditPage } from '../../pages/company-routes-stop-edit/company-routes-stop-edit';
import { CompanyRoutesSelectPage } from '../../pages/company-routes-select/company-routes-select';
import { reorderArray } from 'ionic-angular';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-routes-stop/company-routes-stop.html',
	pipes: [TranslatePipe]
})
export class CompanyRoutesStopPage {

	isReorder = false;
	routeId: string;
	companyKey: string;
	stops: Observable<any>;

	constructor(private nav: NavController, private params: NavParams, private af: AngularFire,
	 private urlConstant: UrlConstant) {
		this.companyKey = params.get('companyKey');
		this.routeId = params.get('routeId');
	}

	ngAfterViewInit(): void {
		this.requestStops();
	}

	requestStops() {
		this.stops = this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes + this.routeId + this.urlConstant.routeStop, {
			query: {
				orderByChild: 'sortIndex'
			}
		});
	}

	toggleReorder() {
		if (this.isReorder) {
			this.isReorder = false;
		} else {
			this.isReorder = true;
		}
	}

	navigateToCreatNewStop() {
		this.nav.setRoot(CompanyRoutesStopAddPage, {
			companyKey: this.companyKey,
			routeId: this.routeId,
			stops: this.stops
		});
	}

	navigateToEditStop(stop) {
		this.nav.setRoot(CompanyRoutesStopEditPage, {
			companyKey: this.companyKey,
			routeId: this.routeId,
			stops: this.stops,
			stop: stop,
		});
	}

	removeStop(stop) {
		this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes + this.routeId + this.urlConstant.routeStop).remove(stop.$key);
	}


	reorderItems(indexes) {
		var arr = <any>[];
		this.stops = this.stops.map((data) => reorderArray(data, indexes))
		this.stops.subscribe((data) => arr = data);
		this.stops.skip(arr.length).subscribe((object) => {
			var i = 0
			object.forEach((data) => {
				data.sortIndex = i;
				i++;
				this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes + this.routeId + this.urlConstant.routeStop).update(data.$key, {
					sortIndex: data.sortIndex
				})
			})
		});
		this.requestStops();
	}

	back() {
		this.nav.setRoot(CompanyRoutesSelectPage, {
			companyKey: this.companyKey,
			routeId: this.routeId,
		});
	}

}
