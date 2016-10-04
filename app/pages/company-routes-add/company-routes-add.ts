import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyRoutesSelectPage } from '../../pages/company-routes-select/company-routes-select';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-routes-add/company-routes-add.html',
	pipes: [TranslatePipe]
})
export class CompanyRoutesAddPage {

	routeId: string;
	routeName: string;
	companyKey: string;
	routes: FirebaseListObservable<any>

	constructor(private nav: NavController, private params: NavParams, 
		private af: AngularFire, private urlConstant: UrlConstant) {
		this.routeId = "";
		this.routeName = "";
		this.companyKey = params.get('companyKey');
		this.routes = this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes);
		this.routes.subscribe((data) => length = data.length);
	}

	navigateToCreatNewRoute() {
		if (this.routeId != "" && this.routeName != "") {
			this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes).update(this.routeId, {
				"name": this.routeName,
				"sortIndex": length++
			})
			this.routeName = "";
			this.nav.setRoot(CompanyRoutesSelectPage, {
				companyKey: this.companyKey
			});
		}
	}

	back() {
		this.nav.setRoot(CompanyRoutesSelectPage, {
			companyKey: this.companyKey
		});
	}

}
