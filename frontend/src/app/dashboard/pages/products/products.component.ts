import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsService } from './products.service';
import { catchError } from 'rxjs';
import { MaterialModule } from '../../../angular-material/material.module';
import { MatSelectChange } from '@angular/material/select';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../interfaces/product.interface';
import { Router } from '@angular/router';
import { NotiflixService } from '../../../shared/services/Notiflix.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MaterialModule, SpinnerComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  private productService = inject(ProductsService);
  private notiflixService = inject(NotiflixService);
  private router = inject(Router);
  displayedColumns: string[] = [
    'sku',
    'name',
    'status',
    'type',
    'catalog_visibility',
    'actions',
  ];
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
}
