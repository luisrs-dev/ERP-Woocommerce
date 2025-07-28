import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  async exportToExcelWithImages(data: any[], fileName: string): Promise<void> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Configurar encabezados
    worksheet.columns = [
      { header: 'Imagen', key: 'image', width: 15 },
      { header: 'Categoria', key: 'category', width: 15 },
      { header: 'Marca', key: 'productBrand', width: 15 },
      { header: 'Nombre', key: 'productName', width: 30 },
      { header: 'Descripción', key: 'variationName', width: 30 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Precio', key: 'price', width: 10 },
    ];

    // Dimensiones estándar para las imágenes
    const imageHeight = 80; // Altura de la imagen en píxeles
    const rowHeight = imageHeight * 0.75; // Ajustar altura de la fila en puntos (1 píxel ≈ 0.75 puntos)

    // Agregar datos y referencias de imagen
    for (const [index, row] of data.entries()) {
      const rowIndex = index + 2; // Saltar la fila de encabezados
      worksheet.addRow({
        category: row.category,
        productBrand: row.productBrand,
        productName: row.productName,
        variationName: row.variationName,
        stock: row.stock,
        price: row.price
      });

      // Ajustar la altura de la fila
      worksheet.getRow(rowIndex).height = rowHeight;

      // Ajustar el ancho de las columnas al contenido
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        // Comprobar si eachCell está disponible y usarlo para obtener la longitud del texto
        if (column.eachCell) {
          // Recorremos cada celda en la columna para determinar la longitud máxima
          column.eachCell({ includeEmpty: true }, (cell) => {
            if (cell.value && cell.value.toString().length > maxLength) {
              maxLength = cell.value.toString().length;
            }
          });
          // Ajustamos el ancho de la columna en base a la longitud del contenido
          column.width = maxLength + 2; // Se agrega un margen para la estética
        }
      });

      if (row.imageUrl) {
        try {
          const imageId = workbook.addImage({
            base64: row.imageUrl,
            extension: 'png',
          });

          worksheet.addImage(imageId, {
            tl: { col: 0, row: rowIndex - 1 }, // Ajustar posición (columna y fila)
            ext: { width: 80, height: 80 }, // Tamaño de la imagen
          });
        } catch (error) {
          console.error(`Error al agregar imagen en la fila ${rowIndex}:`, error);
        }
      }
    }

    // Guardar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }
}
