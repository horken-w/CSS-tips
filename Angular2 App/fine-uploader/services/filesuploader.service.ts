import {Inject, Injectable} from '@angular/core';
import {from} from "linq/linq";
import {isNullOrUndefined} from "util";
import {AuthHttpService} from "../../../../core/service/auth-http.service";
import {APP_CONFIG_TOKEN, Config} from "../../../../core/service/config";
import {Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class FilesuploaderService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'access_token': this.config.common_token
  });
  constructor(
    private authHttpService: AuthHttpService,
    @Inject(APP_CONFIG_TOKEN) public config: Config
  ) { }

  getAllFilesList(dataArray: Array<Object> = []): Array<any> {
    return from(dataArray)
      .where(item => !isNullOrUndefined(item))
      .toArray();
  }

  updateCropZone(data: coords) {
    return this.authHttpService.post('/api/common/clipped', data, {headers: this.headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }
}

interface coords{
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
