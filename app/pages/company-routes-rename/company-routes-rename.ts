import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyRoutesSelectPage } from '../../pages/company-routes-select/company-routes-select';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-routes-rename/company-routes-rename.html',
	pipes: [TranslatePipe]
})
export class CompanyRoutesRenamePage {

	routeId: string;
	routeName: string;
	companyKey: string

	constructor(private nav: NavController, private params: NavParams, private af: AngularFire, 
		private menu: MenuController, private urlConstant: UrlConstant) {
		this.routeId = params.get('routeId');
		this.routeName = params.get('routeName');
		this.companyKey = params.get('companyKey');
	}

	renameRoute() {
		this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.routes).update(this.routeId, {
			name: this.routeName
		});
		this.nav.setRoot(CompanyRoutesSelectPage, {
			companyKey: this.companyKey
		});
	}

	back() {
		this.nav.setRoot(CompanyRoutesSelectPage, {
			companyKey: this.companyKey
		});
	}

}
