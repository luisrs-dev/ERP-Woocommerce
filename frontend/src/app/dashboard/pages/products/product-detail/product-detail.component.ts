import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../angular-material/material.module';
import { NotiflixService } from '../../../../shared/services/Notiflix.service';
import { ProductComponent } from '../../../components/product/product.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ProductComponent],
})
export default class ProductDetailComponent implements OnInit {
  private productService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private notiflixService = inject(NotiflixService);

  public product$: Observable<Product | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      this.notiflixService.block('container-product', 'Cargando producto...');
      const id = params.get('id');
      return id ? this.productService.getProductById(id) : of(null); // Obtener el producto por ID
    }),
    switchMap((product) => {
      if (product && product.variations && product.variations.length > 0) {
        // Si el producto tiene variaciones, obtener las variaciones por sus IDs.
        return forkJoin(
          product.variations.map(
            (variationId: number) =>
              this.productService.getVariationById(product.id, variationId) // Obtener cada variación
          )
        ).pipe(
          map((variations) => {
            // Combinar el producto con sus variaciones
            return { ...product, variations };
          })
        );
      }
      return of(product); // Si no tiene variaciones, simplemente devolver el producto
    }),
    tap((product) => {
      console.log('Producto y variaciones:', product);
      this.notiflixService.unblock('container-product');
    }),
    catchError((error) => {
      console.error('Error al cargar el producto:', error);
      return of(null); // Devuelve un valor por defecto si hay un error
    })
  );

  ngOnInit() {}

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
