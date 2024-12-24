import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlFormat',
  standalone: true,
})
export class UrlFormatPipe implements PipeTransform {

  transform(value: string) {
    if(!value) return value
    return value.split('?')[0]     
  }

}
