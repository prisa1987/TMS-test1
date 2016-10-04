import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { RevenueReportDatePage } from '../../pages/revenue-report-date/revenue-report-date';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/revenue-report/revenue-report.html',
	pipes: [TranslatePipe]
})
export class RevenueReportPage {

	date: any;
	companies: Observable<any>;

	constructor(private nav: NavController, private menu: MenuController, 
		private af: AngularFire, private urlConstant: UrlConstant) {

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

	navigateToDatePicker(company) {
		this.nav.setRoot(RevenueReportDatePage, {
			company: company
		});
	}

}
