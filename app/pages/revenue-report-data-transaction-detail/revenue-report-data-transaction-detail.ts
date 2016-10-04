import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { UrlConstant } from '../../providers/data/url-constant';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { RevenueReportDataPage } from "../../pages/revenue-report-data/revenue-report-data";

@Component({
	templateUrl: 'build/pages/revenue-report-data-transaction-detail/revenue-report-data-transaction-detail.html',
	pipes: [TranslatePipe]
})
export class RevenueReportDataTransactionDetailPage {

	transactions: FirebaseListObservable<any>;
	t: any;
	companyKey: any;
	tripKey: any;
	columns: any;

	constructor(private nav: NavController, private af: AngularFire, private params: NavParams, private urlConstant: UrlConstant) {
		this.companyKey = params.get("companyKey");
		this.tripKey = params.get("tripKey");
		console.log(this.companyKey + " " + this.tripKey);
		this.columns = [{ "id": "UUID", "name": "UUID" },
			{ "id": "originName", "name": "Origin Name"	},
			{ "id": "destinationName", "name": "Destination Name"	},
			{ "id": "paymentType", "name": "Payment Type" },
			{ "id": "adultNo", "name": "Adult Number" },
			{ "id": "adultPrice", "name": "Adult Price" },
			{ "id": "totalFare", "name": "Total" }];

		this.requestTransactions();
	}

	requestTransactions() {
		this.transactions = this.af.database.list(this.urlConstant.bus+ this.companyKey + this.urlConstant.trips + this.tripKey + this.urlConstant.transactions);
	}

	back() {
		this.nav.pop();
	}

}
