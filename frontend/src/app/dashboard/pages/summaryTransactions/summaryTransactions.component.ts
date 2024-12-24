import { MobileService } from './../../../shared/services/mobile.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../angular-material/material.module';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ClpCurrencyPipe } from '../../../shared/pipes/clpCurrency.pipe';
import { GraphComponent } from '../../shared/components/graph/graph.component';
import {
  TransactionSummary,
  TransactionsService,
} from '../transactions/transactions.service';
import { Chart, ChartModule } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

export interface BankTransactions {
  bank: string;
  totals: string;
  paid: string;
  notPaid: string;
  conversion_rate: string;
  amount: string;
  amountPaid: string;
  errors: string;
  warnings: string;
}
@Component({
  selector: 'app-summary-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SpinnerComponent,
    //GraphComponent,
    ClpCurrencyPipe,
    ChartModule,
  ],
  templateUrl: './summaryTransactions.component.html',
  styleUrl: './summaryTransactions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SummaryTransactionsComponent {
  public loadingData: boolean;
  public transactionsSummary: TransactionSummary;
  public chart: Chart;
  public isMobile: boolean;

  public cantidad_total_transacciones_bancos: number;
  public cantidad_total_transacciones_pagadas: number;
  public cantidad_total_transacciones_no_pagadas: number;
  public cantidad_errores: number;
  public conversion_total: number;
  public monto_total_bancos: number;
  public monto_total_pagado: number;

  private changeDetectorRef = inject(ChangeDetectorRef);
  private transactionsService = inject(TransactionsService);
  private mobileService = inject(MobileService);

  public defaultPeriod: string = '10';
  public selectedValue: string;
  displayedColumns: string[] = [
    'banco',
    'total_transacciones',
    'cantidad_transacciones_pagadas',
    'cantidad_transacciones_no_pagadas',
    'conversion',
    'monto_total',
    'monto_pagado',
    'monto_no_pagadas',
    'cantidad_errores',
    'warning',
  ];
  // dataSource: MatTableDataSource<TransactionSummary>;
  dataSource = new MatTableDataSource<TransactionSummary>([]);
  // dataSource = new MatTableDataSource<Transaction>([]);

  public startDate: string;
  public endDate: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.mobileService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.loadingData = true;
    //this.fetchTransactions('10');
  }

  setGraphIndicators() {
    const seriesData = [
      {
        name: 'Errores',
        y: this.cantidad_errores,
        color: '#ff3333',
      },
      {
        name: 'Pagadas',
        y: this.cantidad_total_transacciones_pagadas,
        color: '#0ca86b',
      },
      {
        name: 'No Pagadas',
        y: this.cantidad_total_transacciones_no_pagadas,
        color: '#808080',
      },
    ];

    // if (this.categories && this.data && this.chartType) {
    this.chart = new Chart({
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Transacciones',
      },
      xAxis: {
        categories: ['Pagadas', 'No Pagadas'],
        title: {
          text: 'Transacciones',
        },
      },
      yAxis: {
        title: {
          text: 'N° Registros',
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Transacciones',
          data: seriesData,
        } as SeriesOptionsType,
      ],
    });

    this.changeDetectorRef.detectChanges();
  }

  calculateTotals(transactionsSummary: any) {
    // Calcular las sumas totales
    this.cantidad_total_transacciones_bancos = transactionsSummary.reduce(
      (total: number, item: any) => total + item.total_transacciones,
      0,
    );
    this.cantidad_total_transacciones_pagadas = transactionsSummary.reduce(
      (total: number, item: any) => total + item.cantidad_transacciones_pagadas,
      0,
    );
    this.cantidad_total_transacciones_no_pagadas = transactionsSummary.reduce(
      (total: number, item: any) =>
        total + item.cantidad_transacciones_no_pagadas,
      0,
    );

    this.cantidad_errores = transactionsSummary.reduce(
      (total: number, item: any) =>
        total + item.error,
      0,
    );

    // Calcular la suma de conversion_rate convirtiendo los valores a números
    this.conversion_total = transactionsSummary.reduce(
      (total: number, item: any) => total + parseFloat(item.conversion_rate),
      0,
    );
    this.monto_total_bancos = transactionsSummary.reduce(
      (total: number, item: any) => total + item.monto_total,
      0,
    );
    this.monto_total_pagado = transactionsSummary.reduce(
      (total: number, item: any) => total + item.monto_pagado,
      0,
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPeriodSelected(event: MatSelectChange) {
    this.selectedValue = event.value;
    this.fetchTransactions(this.selectedValue);
  }

  updateTransactions() {
    this.loadingData = false;
    this.fetchTransactions(this.selectedValue);
    this.loadingData = true;
    this.changeDetectorRef.detectChanges();
  }

  fetchTransactions(period: string) {
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case '10':
        startDate = new Date(Date.now() - 10 * 60000); // Últimos 10 minutos
        endDate = new Date();
        break;
      case '30':
        startDate = new Date(Date.now() - 30 * 60000); // Últimos 30 minutos
        endDate = new Date();
        break;
      case '60':
        startDate = new Date(Date.now() - 60 * 60000); // Última hora
        endDate = new Date();
        break;
      case '3':
        startDate = new Date(Date.now() - 3 * 3600000); // Últimas 3 horas
        endDate = new Date();
        break;
      case '6':
        startDate = new Date(Date.now() - 6 * 3600000); // Últimas 6 horas
        endDate = new Date();
        break;
      case '12':
        startDate = new Date(Date.now() - 12 * 3600000); // Últimas 12 horas
        endDate = new Date();
        break;
      case 'day-current':
        startDate = new Date(new Date().setHours(0, 0, 0, 0)); // Inicio del día actual
        endDate = new Date(); // Fin del día actual
        break;
      case 'day-previous':
        startDate = new Date(new Date().setDate(new Date().getDate() - 1)); // Inicio del día anterior
        startDate.setHours(0, 0, 0);
        endDate = new Date(new Date().setDate(new Date().getDate() - 1)); // Fin del día anterior
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return;
    }

    this.loadingData = true;

    this.transactionsService
      .getSummaryTransactions(startDate, endDate)
      .subscribe((response) => {
        this.loadingData = false;        
        
        this.dataSource = new MatTableDataSource(response);
        this.loadingData = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.calculateTotals(response);
        this.setGraphIndicators();

        this.startDate = this.formatDate(startDate);
        this.endDate = this.formatDate(endDate);

        this.loadingData = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
}
