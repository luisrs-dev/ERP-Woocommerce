import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

import { CsvModule } from '@ctrl/ngx-csv';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MaterialModule } from '../../../../angular-material/material.module';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: './exportFiles.component.html',
  standalone: true,
  imports: [MatListModule, MaterialModule, CsvModule],
})
export class ExportFilesComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {}

  export2PDF() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // Formato YYYY-MM-DD
    const formattedTime = currentDate
      .toTimeString()
      .slice(0, 8)
      .replace(/:/g, ':'); // Formato HHMMSS

    const fileName = `Transacciones_${formattedDate}_${formattedTime}.pdf`;

    const formattedData = this.data.map((item: any) => ({
      Transacción: item.transaccion,
      Banco: item.banco,
      Tipo: item.tipo,
      Módulo: item.modulo,
      Mensaje: item.mensaje,
      'Fecha de Alta': item.fecha_alta,
    }));

    // Crear la definición del documento PDF
    const docDefinition: any = {
      pageSize: 'LEGAL', // Tamaño de la página legal (8.5 x 14 pulgadas)
      pageOrientation: 'landscape', // Orientación horizontal
      content: [
        { text: 'Transacciones', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              Object.keys(formattedData[0]), // Headers
              ...formattedData.map((obj: any) => Object.values(obj)), // Data rows
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      },
    };

    //pdfMake.createPdf(docDefinition).download(fileName);
  }
}
