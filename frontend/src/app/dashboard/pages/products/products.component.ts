import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductsService } from './products.service';
import { catchError } from 'rxjs';
import { MaterialModule } from '../../../angular-material/material.module';
import { MatSelectChange } from '@angular/material/select';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../interfaces/orders.interface';
import { Router } from '@angular/router';


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
  private router = inject(Router);
  // public dataSource = new MatTableDataSource<OrdersResponse>([]);

  displayedColumns: string[] = ['sku', 'name', 'status', 'type', 'catalog_visibility', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.productService.getProducts().pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return []; // Retornar un arreglo vacío o cualquier valor predeterminado
      })
    ).subscribe((response) => {
      console.log('Productos obtenidos:', response);
      this.dataSource.data = response;
    });
  }

  onPeriodSelected(event: MatSelectChange){
    console.log('onPeriodSelected');
  }

  updateTransactions(){
    console.log('updateTransactions');

  }
  onProduct(id: string){
    this.router.navigate([`dashboard/producto/${id}`]);
  }
}
