import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Filter } from '../../interfaces/filters.interface';
import {
  ResponseTransactions,
  TransactionCab,
  TransactionRecord,
} from '../../interfaces/transaction.interface';

export interface TransactionSummary {
  banco: string;
  warning: number;
  success: number;
  error: number;
  totales: number;
  monto_pagado: number;
  monto_no_pagadas: number;
  cantidad_errores: number;
  total_transacciones: number;
  cantidad_transacciones_pagadas: number;
  cantidad_transacciones_no_pagadas: number;
  conversion_rate: number;
  monto_total: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor() {}

  private http = inject(HttpClient);
  backend: string = environment.baseUrl;

  getSummaryTransactions(
    startDate?: Date,
    endDate?: Date,
  ): Observable<TransactionSummary[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }

    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }

    return this.http.get<TransactionSummary[]>(`${this.backend}/transaction/summary`, {
      params,
    });
  }

  /**
   * Fetch transactions_cab
   * @param {Date} startDate - Fecha de inicio
   * @param {Date} endDate - Fecha fin
   * @param order - Número de orden de la transacción
   * @returns {Observable<TransactionCab[]>} - Una promesa que se resuelve al obtener las transacciones.
   */
  getTransactionsRecords(
    startDate?: Date,
    endDate?: Date,
    order?: string,
    bank?: string
  ): Observable<TransactionCab[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', this.formatDate(startDate));
    }

    if (endDate) {
      params = params.set('endDate', this.formatDate(endDate));
    }

    if (order) {
      params = params.set('order', order);
    }

    if (bank) {
      params = params.set('bank', bank);
    }

    return this.http.get<TransactionCab[]>(
      `${this.backend}/transaction/cab`,
      { params },
    );
  }

  getTransactionLogById(id: string): Observable<TransactionRecord[]> {
    return this.http.get<TransactionRecord[]>(
      `${this.backend}/transaction/log/${id}`,
    );
  }

  // Registro de archivo log de transacción
  getTransactionRecordLogs(transaction: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.backend}/transaction/records/log/${transaction}`,
    );
  }
  // Transaction LOGS
  getTransactionsLogs(filters?: Filter[]): Observable<ResponseTransactions> {
    let params = new HttpParams();
    if(filters && filters?.length > 0){
      for (const filter of filters) {
        if(filter.value) params = params.set(filter.name, filter.value);
      }
    }

    return this.http.get<ResponseTransactions>(`${this.backend}/transaction/log`, {
      params,
    });
  }

  setDisabled(id: string, newState: boolean):Observable<TransactionCab> {
    return this.http.post<TransactionCab>(`${this.backend}/transaction/state`, { id, state: newState })
  }

  formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
}
