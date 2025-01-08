import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl = 'https://naturapetshop.cl/wp-json/wc/v3/products';
  private http = inject(HttpClient);

  constructor() { }

  getOrders(): Observable<any> {
    // Construir los parámetros
    const params = new HttpParams()
      .set('oauth_consumer_key', '••••••')
      .set('oauth_signature_method', '••••••')
      .set('oauth_timestamp', '••••••')
      .set('oauth_nonce', '••••••')
      .set('oauth_version', '••••••')
      .set('oauth_signature', '••••••');

    // Configurar headers si son necesarios
    const headers = new HttpHeaders({
      'Cookie': 'PHPSESSID=26df05c6563402fa662728f0d9fcafc5'
    });

    // Realizar la solicitud GET
    return this.http.get(this.baseUrl, { headers, params });
  }

}
