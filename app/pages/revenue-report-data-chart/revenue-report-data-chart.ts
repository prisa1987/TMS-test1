import { Directive, ElementRef, Input, OnInit, Component } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import { NavController, Platform, NavParams } from 'ionic-angular';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import { Observable } from 'rxjs/Observable';
import { TranslatePipe } from 'ng2-translate/ng2-translate';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';

@Component({
  selector: 'revenue-report-data-chart',
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'build/pages/revenue-report-data-chart/revenue-report-data-chart.html',
  pipes: [TranslatePipe]
})
export class RevenueReportDataChartPage {

  numberPassangerPerTrip = new Map<string, number>();
  companyKey: any;
  tripKey: any;
  transactions: FirebaseListObservable<any>;

  keys: Array<any> = new Array();
  numbers: Array<number> = new Array();
  fares: Array<number> = new Array();
  arr: Array<any> = new Array();

  constructor(private nav: NavController, public af: AngularFire, private params: NavParams) {
    this.params.get("key").forEach((data) => this.keys.push(data));
    this.params.get("number").forEach((data) => this.numbers.push(data));
    this.params.get("fare").forEach((data) => this.fares.push(data));
  }

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public lineChartData: Array<any> = [
    { data: this.numbers, label: 'Number people per Trips' },
    { data: this.fares, label: 'Total fares per Trips' }
  ];

  public lineChartLabels: Array<any> = this.keys;
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };

  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  back() {
    this.nav.pop();
  }

}
