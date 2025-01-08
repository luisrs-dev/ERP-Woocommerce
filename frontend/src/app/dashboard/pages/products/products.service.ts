import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { Product } from '../../interfaces/orders.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private baseUrl = 'https://naturapetshop.cl/wp-json/wc/v3/products';
  private consumerKey = 'ck_25deff5c5fecfc5640de0891e3f86dc1f5ebb386';
  private consumerSecret = 'cs_57ba329365de4e0eb8f9ac135589d4912134ccdc';

  constructor() { }

  // private generateNonce(length: number): string {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let nonce = '';
  //   for (let i = 0; i < length; i++) {
  //     nonce += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }
  //   return nonce;
  // }

  // private generateOAuthSignature(method: string, params: any): string {
  //   // Ordenar los parámetros alfabéticamente por clave
  //   const sortedParams = Object.keys(params)
  //     .sort()
  //     .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  //     .join('&');

  //   // Crear la base string
  //   const baseString = `${method.toUpperCase()}&${encodeURIComponent(this.baseUrl)}&${encodeURIComponent(sortedParams)}`;

  //   // Crear la clave de firma
  //   const signingKey = `${encodeURIComponent(this.consumerSecret)}&`;

  //   // Generar la firma HMAC-SHA1 y devolverla codificada en Base64
  //   return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(baseString, signingKey));
  // }

  // getProducts() {
  //   const oauthTimestamp = Math.floor(Date.now() / 1000).toString();
  //   const oauthNonce = this.generateNonce(16);

  //   const oauthParams: { [key: string]: string } = {
  //     oauth_consumer_key: this.consumerKey,
  //     oauth_nonce: oauthNonce,
  //     oauth_signature_method: 'HMAC-SHA1',
  //     oauth_timestamp: oauthTimestamp,
  //     oauth_version: '1.0',
  //   };
  //   oauthParams['oauth_signature'] = this.generateOAuthSignature('GET', oauthParams);


  //   // Configurar parámetros para la solicitud
  //   const params = new HttpParams({ fromObject: oauthParams });

  //   // Configurar headers si son necesarios
  //  // const headers = new HttpHeaders({
  //    // 'Cookie': 'PHPSESSID=26df05c6563402fa662728f0d9fcafc5'
  //   //});

  //   // Realizar la solicitud GET
  //   return this.http.get(this.baseUrl, { params, withCredentials: true }).pipe(
  //     catchError((error) => {
  //       console.error('Error:', error);
  //       throw error;
  //     })

  //   );
  // }


  getProducts(): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.consumerKey + ':' + this.consumerSecret)
    });

    return this.http.get<Product[]>(this.baseUrl, { headers, withCredentials: true });
  }

  getProductById(id: string): Observable<Product> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.consumerKey + ':' + this.consumerSecret)
    });

    return this.http.get<Product>(`${this.baseUrl}/${id}`, { headers, withCredentials: true });
  }

}
