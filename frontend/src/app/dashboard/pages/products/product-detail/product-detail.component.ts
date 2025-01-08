import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../interfaces/orders.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export default class ProductDetailComponent implements OnInit {
  private productService = inject(ProductsService);
  private route = inject(ActivatedRoute);


  public product$: Observable<Product | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.productService.getProductById(id) : of(null);
    }),
    catchError((error) => {
      console.error('Error al cargar el producto:', error);
      return of(null); // Devuelve un valor por defecto si hay un error
    })
  );  public isLoading: boolean = true;

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id')!;

    // if (id) {
    //   this.productService.getProductById(id).subscribe({
    //     next: (data) => {
    //       this.product = data;
    //       console.log(this.product);
    //       console.log(this.product.name);
    //       console.log(this.product.categories);

    //       this.isLoading = false;
    //       console.log(this.isLoading && this.product);
    //     this.changeDetectorRef.detectChanges();


    //     },
    //     error: (err) => {
    //       console.error('Error al cargar el producto', err);
    //       this.isLoading = false;
    //     },
    //   });
    // }
  }
}
