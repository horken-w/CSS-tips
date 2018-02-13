import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {

  transform(value: Array<any>, amount: number): Array<Array<any>> {
    let group = new Array();
    if(!value || !amount)
      group.push(value);
    else{
      for(let i = 0; i < Math.ceil(value.length / amount); i++){
        group.push(value.slice(amount * i, amount * (i + 1)))
      }
    }
    return group;


  }

}