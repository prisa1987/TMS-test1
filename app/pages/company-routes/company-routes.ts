import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyRoutesSelectPage } from '../../pages/company-routes-select/company-routes-select';
import { CompanyPage } from '../../pages/company/company';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-routes/company-routes.html',
	pipes: [TranslatePipe]
})
export class CompanyRoutesPage {

	companyRoutes: Observable<any>;
	companies: Observable<any>;

	constructor(private nav: NavController, 
		private menu: MenuController, private af: AngularFire, 
		private urlConstant: UrlConstant) {

	}

	ngAfterViewInit(): void {
		this.requestCompanies();
	}

	requestCompanies() {
		this.companies = this.af.database.list(this.urlConstant.bus, {
			query: {
				orderByChild: 'sortIndex'
			}
		});
	}

	navigateToCreatNewCompany(companyKey) {
		this.menu.close();
		this.nav.setRoot(CompanyRoutesSelectPage, {
			companyKey: companyKey
		});
	}

	back() {
		this.nav.setRoot(CompanyPage);
	}

}
