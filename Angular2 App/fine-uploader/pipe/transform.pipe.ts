import { Pipe, PipeTransform } from '@angular/core';
import {isNullOrUndefined} from "util";

@Pipe({
  name: 'transform'
})
export class TransformPipe implements PipeTransform {

  transform(value: any, size: string, backup_size?: string): string {
    if(isNullOrUndefined(value))
      return '/images/no-pic.png';

    if(!isNullOrUndefined(value.transform) && (size in value.transform))
      return value.transform[size];
    else if(backup_size in value.transform) return value.transform[backup_size];

    return value.original;
  }

}
