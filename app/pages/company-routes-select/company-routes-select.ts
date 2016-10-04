import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyRoutesAddPage } from '../../pages/company-routes-add/company-routes-add';
import { CompanyRoutesRenamePage } from '../../pages/company-routes-rename/company-routes-rename';
import { CompanyRoutesStopPage } from '../../pages/company-routes-stop/company-routes-stop';
import { CompanyRoutesPage } from '../../pages/company-routes/company-routes';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-routes-select/company-routes-select.html',
	pipes: [TranslatePipe]
})
export class CompanyRoutesSelectPage {

	companyKey: any;
	routes: any;

	constructor(private nav: NavController,private params: NavParams, private af: AngularFire,
	 private menu: MenuController, private urlConstant: UrlConstant) {
		this.companyKey = params.get('companyKey');
	}

	ngAfterViewInit(): void {
		this.requestRoutes();
	}

	requestRoutes() {
		this.routes = this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes, {
			query: {
				orderByChild: 'sortIndex'
			}
		});
	}

	navigateToRouteStop(route) {
		this.menu.close();
		this.nav.setRoot(CompanyRoutesStopPage, {
			companyKey: this.companyKey,
			routeId: route.$key
		});
	}

	navigateToRenameRoute(route) {
		this.menu.close();
		this.nav.setRoot(CompanyRoutesRenamePage, {
			companyKey: this.companyKey,
			routeId: route.$key,
			routeName: route.name
		});
	}

	removeRoute(route) {
		this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes).remove(route.$key);
	}

	navigateToCreatNewRoute() {
		this.menu.close();
		this.nav.setRoot(CompanyRoutesAddPage, {
			companyKey: this.companyKey
		});
	}

	back() {
		this.nav.setRoot(CompanyRoutesPage);
	}

}
