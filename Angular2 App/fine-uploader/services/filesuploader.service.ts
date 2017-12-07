import { Injectable } from '@angular/core';
import {from} from "linq/linq";
import {isNullOrUndefined} from "util";

@Injectable()
export class FilesuploaderService {

  constructor() { }

  getAllFilesList(dataArray: Array<Object> = []): Array<any> {
    return from(dataArray)
      .where(item => !isNullOrUndefined(item))
      .toArray();
  }

  resetAllRepresentImg(items: Array<object>){
    items.forEach((data) => { // reset all represent img selected
      data['represent'] = false;
    })
    return items;
  }
}
