import {Injectable} from '@angular/core';

@Injectable()
export class FilesuploaderService {
  // private headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'access_token': 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjb21tb24iLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJpc3MiOiJsb2NhbGhvc3Q6NDIwMCIsImlhdCI6MTUxMTI0NDI3Mywicm9sZXMiOlsiUk9MRV9DT01NT04iXX0.3Cy6REUsfE1dgwE_ICOn93AIAhu4QYEPahvpfAhZXO1jYrNkmByI2g4SjFcjGAKNjQWnm_TkS49oUK7wj-vxNQ'
  // });
  constructor(
    // private authHttpService: HttpClient
  ) { }


  updateCropZone(data: Coords) {
    // return this.authHttpService.post('http://localhost:8080/api/common/clipped', data, {headers: this.headers})
    //   .catch(error => Observable.throw(error));
  }

  resetAllRepresentImg(items: Array<object>){
    items.forEach((data) => { // reset all represent img selected
      data['represent'] = false;
    });
    return items;
  }
}

interface Coords {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
