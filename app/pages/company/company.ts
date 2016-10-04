import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Observable} from 'rxjs/Observable';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import { CompanyAddPage} from '../../pages/company-add/company-add';
import { CompanyRenamePage } from '../../pages/company-rename/company-rename';
import { UrlConstant } from '../../providers/data/url-constant';
import { Events } from 'ionic-angular';
import { reorderArray } from 'ionic-angular';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/company/company.html',
	pipes: [TranslatePipe]
})
export class CompanyPage {

	companies: Observable<any>;
	isReorder = false;

	constructor(private nav: NavController, private menu: MenuController, private af: AngularFire, 
		private urlConstant: UrlConstant) {
	}

	ngAfterViewInit(): void {
		this.requestCompanites();
	}

	requestCompanites() {
		this.companies = this.af.database.list(this.urlConstant.bus, {
			query: {
				orderByChild: 'sortIndex'
			}
		});
	}

	toggleReorder() {
		if (this.isReorder) {
			this.isReorder = false;
		} else {
			this.isReorder = true;
		}
	}

	removeCompany(company) {
		this.af.database.list(this.urlConstant.bus).remove(company.$key);
	}

	reorderItems(indexes) {
		var arr = <any>[];
		this.companies = this.companies.map((data) => reorderArray(data, indexes))
		this.companies.subscribe((data) => arr = data);
		this.companies.skip(arr.length).subscribe((object) => {
			var i = 0
			object.forEach((data) => {
				data.sortIndex = i;
				i++;
				this.af.database.list(this.urlConstant.bus).update(data.$key, {
					sortIndex: data.sortIndex
				})
			})
		});
		this.requestCompanites();
	}

	navigateToCreatNewCompany() {
		this.menu.close();
		this.nav.setRoot(CompanyAddPage, {
			companies: this.companies
		});
	}

	navigateToRenameCompany(company) {
		this.menu.close();
		this.nav.setRoot(CompanyRenamePage, {
			company: company
		});
	}

	back() {
		this.nav.pop();
	}

}
