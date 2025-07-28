import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { MaterialModule } from '../../../angular-material/material.module';
import { ProductsService } from '../../pages/products/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [CommonModule, MaterialModule],
  standalone: true
})
export class ProductComponent implements OnInit {

  @Input() product: Product | null = null;

  private productService = inject(ProductsService);

  constructor() { }

  ngOnInit() {
  }

  onUpdateStock(
    productId: number,
    variationId: number,
    stock_quantity: number
  ) {
    console.log('actualizando datos');
    console.log({ productId, variationId, stock_quantity });

    this.productService
      .updateVariation(productId, variationId, { stock_quantity })
      .subscribe({
        next: (response) => {
          console.log('Stock actualizado con éxito:', response);
        },
        error: (error) => {
          console.error('Error al actualizar el stock:', error);
        },
      });
  }

}
