import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable()
export class MultiSelectService {
  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  apiHost = environment.apiHost;
  constructor(
    private http: HttpClient,
  ) {
  }

  getSourceData(path?: string, siteToken?: string, cataType?: string) {
    this.headers.set('access_token', localStorage.getItem('access_token'));
    if (!siteToken)
      this.headers.set('site_token', localStorage.getItem('site_token'));
    else this.headers.set('site_token', siteToken);

    return this.http.get<any>(this.apiHost + path)
      .catch((error) => Observable.throw(error));
    // switch (cataType) {
    //   case 'keyword':
    //
      // case 'eventcategory':
      //   return this.authHttpService.get('/backend/api/autoComplete/menu/category/' + path, {headers: this.headers})
      //     .take(1).catch((error) => Observable.throw(error));
      // case 'peoplecategory':
      //   return this.authHttpService.get('/backend/api/autoComplete/module/category/' + path, {headers: this.headers})
      //     .take(1).catch((error) => Observable.throw(error));
      // case 'timeline':
      //   return this.authHttpService.get('/backend/api/autoComplete/timeline/' + path, {headers: this.headers})
      //     .take(1).catch((error) => Observable.throw(error));
      // case 'skills':
      //   return this.authHttpService.get('/backend/api/autoComplete/personExpertise', {headers: this.headers})
      //     .take(1).catch((error) => Observable.throw(error));
      // case 'mainCategories':
      //   return this.authHttpService.get('/backend/api/collection/digital/mainCategory/' + path , {headers: this.headers})
      //     .take(1).catch((error) => Observable.throw(error));
      // case 'subCategories':
      //   return this.authHttpService.get('/backend/api/collection/digital/subCategory/' + path , {headers: this.headers})
      //     .take(1).catch((error) => Observable.throw(error));
    // }
  }
}
