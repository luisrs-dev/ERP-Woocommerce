import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    const [fecha, horaNoFormateada] = value.split('T');
    const partsDate = fecha.split('-');
    const hora = horaNoFormateada.split('.')[0];
    return `${partsDate[2]}-${partsDate[1]}-${partsDate[0]} ${hora}`;
  }
}
