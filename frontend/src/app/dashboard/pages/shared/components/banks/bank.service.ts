import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ResponseBanks } from './interfaces';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private apiUrl = `${environment.conector}/parametros/bancos`;
  private authToken = '4jNECSfZj8rEWVLdSmEiBD8PV7UInHcyoieinVpN';
  private http = inject(HttpClient);

  getBancos(): Observable<ResponseBanks> {
    const headers = new HttpHeaders({
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'accept': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    });

    return this.http.get<ResponseBanks>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching banks:', error);
        return throwError(() => error);
      })
    );
  }

}
