import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clpCurrency',
  standalone: true
})
export class ClpCurrencyPipe implements PipeTransform {
  transform(value: number | string) {

    if(typeof value == 'string'){
        value = Number(value);
    }
    // Formatear el valor a moneda chilena (CLP)
    const formattedValue = value.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
    return formattedValue;
  }
}