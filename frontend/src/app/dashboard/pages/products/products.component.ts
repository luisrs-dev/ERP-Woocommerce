import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductsService } from './products.service';
import { BehaviorSubject, catchError } from 'rxjs';
import { MaterialModule } from '../../../angular-material/material.module';
import { MatSelectChange } from '@angular/material/select';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../interfaces/product.interface';
import { Router } from '@angular/router';
import { NotiflixService } from '../../../shared/services/Notiflix.service';
import { ExportExcelService } from '../../../shared/services/Excel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MaterialModule, SpinnerComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export default class ProductsComponent {
  private productService = inject(ProductsService);
  private notiflixService = inject(NotiflixService);
  private exportExcelService = inject(ExportExcelService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  public products: Product[];
  public exportingData: boolean = false;

  private router = inject(Router);
  displayedColumns: string[] = ['sku', 'name', 'status', 'type', 'catalog_visibility', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.notiflixService.block('products-list', 'Cargando productos');
    this.productService
      .getProducts()
      .pipe(
        catchError((error) => {
          console.error('Error en la solicitud:', error);
          return []; // Retornar un arreglo vacío o cualquier valor predeterminado
        })
      )
      .subscribe((response) => {
        this.products = response;
        console.log('Productos obtenidos:', response);
        this.dataSource.data = response;
        this.notiflixService.unblock('products-list');
      });
  }

  onPeriodSelected(event: MatSelectChange) {
    console.log('onPeriodSelected');
  }

  updateTransactions() {
    console.log('updateTransactions');
  }
  onProduct(id: string) {
    this.router.navigate([`dashboard/producto/${id}`]);
  }

  detailType(product: Product): { type: string; variations: number } {
    if (product.type == 'variable') {
      return { type: 'Variable', variations: product.variations.length };
    } else {
      return { type: 'Simple', variations: 0 };
    }
  }

  public generateSku(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    const randomLetters = Array.from({ length: 3 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const randomNumbers = Array.from({ length: 5 }, () =>
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    ).join('');

    return `${randomLetters}${randomNumbers}`;
  }

  exportData(): void {
    this.notiflixService.block('block-export-csv', 'Exportando...');
    this.productService.getProductsWithVariations(this.products).subscribe(async (detailedData) => {
      const dataForExcel = await Promise.all(
        detailedData.map(async (row) => {
          const imageUrlBase64 = row.imageUrl ? await this.getBase64Image(row.imageUrl) : `${row.name} no tiene imagen`;
          return {
            ...row,
            imageUrl: imageUrlBase64,
          };
        })
      );

      this.exportExcelService.exportToExcelWithImages(dataForExcel, 'stock_productos');
      this.notiflixService.unblock('block-export-csv');
    });
    // this.exportingData = false;
    // this.changeDetectorRef.detectChanges();
  }

  private async getBase64Image(imageUrl: string): Promise<string> {
    if (imageUrl.startsWith('data:image')) {
      return imageUrl; // Ya está en formato Base64.
    }
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
