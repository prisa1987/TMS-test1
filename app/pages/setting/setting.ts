import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data/data';
import { TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

@Component({
	templateUrl: 'build/pages/setting/setting.html',
	pipes: [TranslatePipe]
})
export class SettingPage {

	language: any;

	constructor(private nav: NavController, public translate: TranslateService,  public dataService: Data) {
		this.language = this.translate.currentLang;
	}

	changeLanguage(lang) {
		this.translate.use(lang);
	}

}
