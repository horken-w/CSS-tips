import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fakeArray'
})
export class FakeArrayRangePipe implements PipeTransform {

  transform(num: any): Array<number> {
      const items: number[] = [];
      for (let i = 0; i < num; i++) {
        items.push(i);
      }
      return items;
  }

}