import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the CompanyRoutePipe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'companyRoutePipe'
})
@Injectable()
export class CompanyRoutePipe {
  transform(value, args: any[]) {
      let companyRoute = [];
      for(let key in value) {
        companyRoute.push({key: key, value:value[key]});
      }
      return companyRoute;
  }
}
