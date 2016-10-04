import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { RevenueReportDataChartPage } from '../../pages/revenue-report-data-chart/revenue-report-data-chart';
import { RevenueReportDataTransactionDetailPage } from '../../pages/revenue-report-data-transaction-detail/revenue-report-data-transaction-detail';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { UrlConstant } from '../../providers/data/url-constant'
import { RevenueReportPage } from '../../pages/revenue-report/revenue-report';

declare var alasql;

@Component({
	templateUrl: 'build/pages/revenue-report-data/revenue-report-data.html',
	pipes: [TranslatePipe]
})
export class RevenueReportDataPage {

	columns: any;
	trips: any;
	companyKey: any;
	tripFilter = new Array();
	transactions: Observable<any>;
	beginDate: number;
	endDate: number;
	dateMap = new Map<string, number>();

	constructor(private nav: NavController, private af: AngularFire, private params: NavParams, private urlConstant: UrlConstant) {
		this.columns = [{ "id": "driverId", "name": "Driver" }, { "id": "route", "name": "Route" }, { "id": "vehicleId", "name": "Vehicle" }, { "id": "tripStartTime", "name": "Start Time" }];
		this.companyKey = params.get("companyKey");
		this.beginDate = params.get("beginDate");
		this.endDate = params.get("endDate");
		this.requestReportData();
	}

	ngAfterViewInit(): void {

	}

	requestReportData() {
		var arr = <any>[];
		var tripList = this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.trips);
		tripList.subscribe((data) => { arr = data; });
		tripList.skip(arr.length).subscribe((data) => {
			data.forEach((a) => {
				var l = Math.floor(a.tripStartTime / 1000000);
				if (l >= this.beginDate && l <= this.endDate) {
					this.tripFilter.push(a);
				}
				this.trips = this.tripFilter;
			})
		});

	}

	exportToExcel() {
		var res = alasql('SELECT driverId AS Driver ,route AS Route,vehicleId AS Vehicle,tripStartTime AS StartTime INTO XLS("MyAwesomeData.xls",{headers:true}) FROM ?',
			[this.tripFilter]);
	}

	navigateToChart() {
		var i = 0;
		var numbers = new Array();
		var keys = new Array();
		var fares = new Array();
		this.tripFilter.forEach((data) => {
			var adultNumber = 0;
			var fare = 0;
			var transactions = this.af.database.list(this.urlConstant.bus + this.companyKey + this.urlConstant.trips + data.$key + this.urlConstant.transactions);
			var arr = <any>[];
			transactions.subscribe((data) => { arr = data });
			transactions.skip(arr.length).subscribe((s) => {
				s.forEach((transaction) => {
					adultNumber = adultNumber + transaction.adultNo;
					fare = fare + transaction.totalFare;
				})

				keys.push(data.$key);
				numbers.push(adultNumber);
				fares.push(fare);

			})
			i++;
		});


		this.nav.push(RevenueReportDataChartPage, {
			number: numbers,
			key: keys,
			fare: fares
		});
	}

	navigateToDetail(tripKey, hasTransaction) {
		if (hasTransaction) {
			this.nav.push(RevenueReportDataTransactionDetailPage, {
				companyKey: this.companyKey,
				tripKey: tripKey
			});
		}
	}

	hasTransaction(transaction) {
		if (transaction) {
			return true;
		} else {
			return false;
		}
	}

	back() {
		this.nav.setRoot(RevenueReportPage);
	}


}
