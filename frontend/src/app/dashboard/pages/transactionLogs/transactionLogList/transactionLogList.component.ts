import { TransactionLogDetailComponent } from './../transactionLogDetail/transactionLogDetail.component';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  type OnInit,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../angular-material/material.module';
import { DateFormatPipe } from '../../../../shared/pipes/DateFormat.pipe';
import { ClpCurrencyPipe } from '../../../../shared/pipes/clpCurrency.pipe';
import { TransactionsService } from '../../transactions/transactions.service';
import { MobileService } from '../../../../shared/services/mobile.service';
import { Transaction } from '../../../interfaces/transaction.interface';
import { Filter } from '../../../interfaces/filters.interface';
import { ExportFilesComponent } from '../exportFiles/exportFiles.component';
import { AdvancedFilterComponent } from '../advanced-filter/advanced-filter.component';

@Component({
  selector: 'app-transaction-log-list',
  standalone: true,
  imports: [MaterialModule, DateFormatPipe, ClpCurrencyPipe],
  providers: [provideNativeDateAdapter()],
  styleUrl: 'transactionLogList.component.css',
  templateUrl: './transactionLogList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TransactionLogListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('moduloSelect') moduloSelect: MatSelect;
  @ViewChild('tipoSelect') tipoSelect: MatSelect;
  @ViewChild('input') input: ElementRef;

  private transactionService = inject(TransactionsService);
  public dialog = inject(MatDialog);
  private _bottomSheet = inject(MatBottomSheet);
  private mobileService = inject(MobileService);
  public imgNotFound = '../../../../assets/images/not-found.jpg';
  public selectedPeriod = '10';

  public selectedRowIndex: number = -1;
  public showThumbnailValue: boolean = false;
  public thumbnailXPosition: number = 0;
  public thumbnailYPosition: number = 0;

  public isMobile: boolean;
  public loadingData: boolean;
  private transactions: Transaction[];
  private transactionsOriginal: Transaction[];
  dataSource = new MatTableDataSource<Transaction>([]);

  dateRangeStart: any;
  dateRangeEnd: any;

  displayedColumns: string[] = [
    'actions',
    'transaccion',
    'nro_transaccion',
    'monto',
    'banco',
    'modulo',
    'fecha_alta',
    'mensaje',
    'tipo',
  ];

  ngOnInit() {
    const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // Inicio día actual
    const endDate = new Date();
    this.filters = [];
    this.filters.push({ name: 'startDate', value: this.formatDate(startDate) });
    this.filters.push({ name: 'endDate', value: this.formatDate(endDate) });
    this.fetchTransactions(this.selectedPeriod);
    this.mobileService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public filters: Filter[];
  announcer = inject(LiveAnnouncer);

  remove(filterToRemove: Filter): void {
    this.filters = this.filters.filter(
      (filter) => filter.name != filterToRemove.name,
    );
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = '';
    }
    this.fetchTransactions(this.selectedPeriod);
  }

  openBottomSheet(): void {
    this._bottomSheet.open(ExportFilesComponent, {
      data: this.dataSource.filter
        ? this.dataSource.filteredData
        : this.dataSource.data,
    });
  }

  applyFilterInput(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = '';
    }
    this.dataSource.filter = '';
    this.dataSource.data = [...this.transactionsOriginal];

    this.filters = [];
    this.setOriginalData();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setOriginalData() {
    this.loadingData = true;
    this.transactionsOriginal = [...this.transactionsOriginal];

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.transactions;

    this.paginator.pageSize = 10; // Define el número de elementos por página
    this.loadingData = false;
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

    console.log(startDate);
    console.log(endDate);

    this.loadingData = true;

    console.log({ filters: this.filters });

    this.transactionService
      .getTransactionsLogs(this.filters)
      .subscribe(({ transactions, filters }) => {
        console.log(transactions);

        this.transactions = transactions;
        this.transactionsOriginal = [...transactions];

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = this.transactions;

        this.paginator.pageSize = 10; // Define el número de elementos por página
        this.loadingData = false;
      });
  }

  updateTransactions() {
    this.fetchTransactions('10');
  }

  openAdvancedFilterDialog(): void {
    const bancos = [
      ...new Set(this.transactions.map((transaction) => transaction.banco)),
    ];
    const tipos = [
      ...new Set(this.transactions.map((transaction) => transaction.tipo)),
    ];
    const modulos = [
      ...new Set(this.transactions.map((transaction) => transaction.modulo)),
    ];

    const dialogRef = this.dialog.open(AdvancedFilterComponent, {
      width: this.isMobile ? '95%' : '70%',
      height: this.isMobile ? '80%' : '60%',
      data: { bancos, tipos, modulos, filtros: this.filters },
    });

    // Escucha el evento filterApplied emitido por AdvancedFilterComponent
    dialogRef.componentInstance.filterApplied.subscribe((filters: Filter[]) => {
      this.transactionService
        .getTransactionsLogs(filters)
        .subscribe(({ transactions, filters }) => {
          console.log(transactions);
          console.log(filters);

          this.dataSource.data = transactions;
          this.filters = filters;
          dialogRef.close();
        });
    });
  }

  viewInfo(transaction: Transaction) {
    this.dialog.open(TransactionLogDetailComponent, {
      width: this.isMobile ? '90%' : '80%',
      height: this.isMobile ? '90%' : '95%',
      data: { transaction },
    });
  }

  showThumbnail(event: MouseEvent, rowIndex: number) {
    this.selectedRowIndex = rowIndex;
    this.showThumbnailValue = true;
    // Valores se ajustan a la posición del event mouseover
    this.thumbnailXPosition = event.clientX + 10;
    this.thumbnailYPosition = event.clientY + 10;
  }

  hideThumbnail() {
    this.selectedRowIndex = -1;
    this.showThumbnailValue = false;
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
