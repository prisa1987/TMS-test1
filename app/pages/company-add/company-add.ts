import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { CompanyPage } from '../../pages/company/company';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-add/company-add.html',
	pipes: [TranslatePipe]
})
export class CompanyAddPage {

	companyName: string;
	companies: FirebaseListObservable<any>;

	constructor(private nav: NavController, private menu: MenuController,
	 private af: AngularFire, private urlConstant: UrlConstant) {
		this.companyName = 'Company_Name';
		this.companies = this.af.database.list(this.urlConstant.bus);
		this.companies.subscribe((data) => {
			length = data.length;
		})
	}

	createNewCompany() {
		if (this.companyName != "") {
			this.companies.push({
				"name": this.companyName,
				"sortIndex": length++
			})
			this.companyName = "";
			this.nav.setRoot(CompanyPage);
		}

	}

	back() {
		this.nav.setRoot(CompanyPage);
	}

}
