import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Product } from '../../interfaces/product.interface';
import { Variation } from '../../interfaces/variaton.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  private baseUrl = 'https://naturapetshop.cl/wp-json/wc/v3/products';
  private consumerKey = 'ck_25deff5c5fecfc5640de0891e3f86dc1f5ebb386';
  private consumerSecret = 'cs_57ba329365de4e0eb8f9ac135589d4912134ccdc';

  constructor() {}

  getProducts(): Observable<Product[]> {
    const headers = new HttpHeaders({
      Authorization:
        'Basic ' + btoa(this.consumerKey + ':' + this.consumerSecret),
    });

    return this.http.get<Product[]>(this.baseUrl, {
      headers,
      withCredentials: true,
    });
  }

  getProductById(id: string): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization:
        'Basic ' + btoa(this.consumerKey + ':' + this.consumerSecret),
    });

    return this.http.get<Product>(`${this.baseUrl}/${id}`, {
      headers,
      withCredentials: true,
    });
  }

  // Método para obtener las variaciones por sus IDs
  getVariationById(
    productId: number,
    variationId: number
  ): Observable<Variation> {
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        `${this.consumerKey}:${this.consumerSecret}`
      )}`,
    });

    return this.http.get<Variation>(
      `${this.baseUrl}/${productId}/variations/${variationId}`,
      { headers, withCredentials: true }
    );
  }

  updateVariation(
    productId: number,
    variationId: number,
    updateData: Partial<{
      stock_quantity: number;
      regular_price: string;
      sale_price?: string;
    }>
  ): Observable<any> {
    const url = `${this.baseUrl}/${productId}/variations/${variationId}`;
    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(
        `${this.consumerKey}:${this.consumerSecret}`
      )}`,
    });

    return this.http.put(url, updateData, { headers, withCredentials: true });
  }
}
