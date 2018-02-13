import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformToString'
})
export class TransformToStringPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let data;

    if(value){
      if(args === 'array') data = value.toString();
      else if(args === 'object') data = value;
    }
    return data;
  }

}
