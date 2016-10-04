import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { RevenueReportDataPage } from '../../pages/revenue-report-data/revenue-report-data';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/revenue-report-date/revenue-report-date.html',
	pipes: [TranslatePipe]
})
export class RevenueReportDatePage {

	beginDate = "";
	endDate = new Date().toISOString().substring(0, 10);

	constructor(private nav: NavController, private menu: MenuController, private params: NavParams) {
	}

	navigateToReportData() {
		this.menu.close();
		this.nav.setRoot(RevenueReportDataPage, {
			companyKey: this.params.get("company").$key,
			beginDate: this.beginDate.replace(/-/gi, ""),
			endDate: this.endDate.replace(/-/gi, "")
		});
	}

}
