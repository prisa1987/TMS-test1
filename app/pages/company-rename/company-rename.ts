import { Component } from '@angular/core';
import { NavController, MenuController, NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyPage } from '../../pages/company/company';
import { Events } from 'ionic-angular';
import { UrlConstant } from '../../providers/data/url-constant'
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company-rename/company-rename.html',
	pipes: [TranslatePipe]
})
export class CompanyRenamePage {

	companyName: string;
	company: any;
	companies: FirebaseListObservable<any>;

	constructor(private nav: NavController, private menu: MenuController, private af: AngularFire,
		private navParams: NavParams, private urlConstant: UrlConstant) {
		this.company = navParams.get("company");
		this.companyName = this.company.name;
	}

	renameCompany() {
		this.af.database.list(this.urlConstant.bus).update(this.company.$key, {
			name: this.companyName
		});
		this.nav.setRoot(CompanyPage);
	}

	back() {
		this.nav.setRoot(CompanyPage);
	}

}
