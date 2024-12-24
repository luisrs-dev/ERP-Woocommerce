import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../angular-material/material.module';
import { DateFormatPipe } from '../../../shared/pipes/DateFormat.pipe';
import { ClpCurrencyPipe } from '../../../shared/pipes/clpCurrency.pipe';
import { Filter } from '../../interfaces/filters.interface';
import {
  Transaction,
  TransactionCab,
} from '../../interfaces/transaction.interface';
import { MobileService } from './../../../shared/services/mobile.service';
import { TransactionDetailComponent } from './components/transactionDetail/transactionDetail.component';
import { TransactionsService } from './transactions.service';
import { ExportFilesComponent } from '../transactionLogs/exportFiles/exportFiles.component';
import { SecondsToMinutesPipe } from '../../../shared/pipes/secondsToMinutes.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { TransactionLogComponent } from './components/TransactionLog/TransactionLog.component';
import { MatDatepickerModule, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormField, MatInput } from '@angular/material/input';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DateFormatPipe,
    ClpCurrencyPipe,
    SecondsToMinutesPipe,
    SpinnerComponent,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter(), DatePipe],
  styleUrl: 'transactions.component.css',
  templateUrl: './transactions.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TransactionsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('moduloSelect') moduloSelect: MatSelect;
  @ViewChild('tipoSelect') tipoSelect: MatSelect;
  @ViewChild('input') input: ElementRef;

  @ViewChild('startDateAdvanced') startDateAdvanced: MatDateRangeInput<Date>;
  @ViewChild('order') order: MatFormField;


  private transactionService = inject(TransactionsService);
  public dialog = inject(MatDialog);
  private _bottomSheet = inject(MatBottomSheet);
  private mobileService = inject(MobileService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  private datePipe = inject(DatePipe);

  public imgNotFound = '../../../../assets/images/not-found.jpg';
  public loadingData: boolean = false;
  public startDate: string;
  public endDate: string;
  public selectedPeriodValue: string = '10';

  public selectedRowIndex: number = -1;
  public showThumbnailValue: boolean = false;
  public thumbnailXPosition: number = 0;
  public thumbnailYPosition: number = 0;

  public activeAdvancedSearch: boolean = false;
  public isMobile: boolean;
  public loadingTransactions: boolean;
  public loadingDisabledTransactions: boolean = false;
  private transactions: any;
  private transactionsOriginal: any;
  dataSource = new MatTableDataSource<TransactionCab>([]);

  dateRangeStart: any;
  dateRangeEnd: any;

  displayedColumns: string[] = [
    'nro_orden',
    'monto',
    'banco',
    'fecha',
    'tiempo_sesion',
    'estado',
    'activa',
  ];

  ngOnInit() {
    this.fetchTransactions('10');
    this.mobileService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public filters: Filter[];
  announcer = inject(LiveAnnouncer);

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
    this.loadingTransactions = true;
    this.transactionsOriginal = [...this.transactionsOriginal];

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.transactions;

    this.paginator.pageSize = 20; // Define el número de elementos por página
    this.loadingTransactions = false;
  }

  updateTransactions() {
    this.dataSource.data = [];
    this.fetchTransactions(this.selectedPeriodValue);
  }

  viewInfo(transactionCab: TransactionCab) {
    this.dialog.open(TransactionDetailComponent, {
      width: this.isMobile ? '90%' : '80%',
      height: this.isMobile ? '90%' : '95%',
      data: { transactionCab },
    });
  }

  viewLog(transactionCab: TransactionCab) {
    this.dialog.open(TransactionLogComponent, {
      width: this.isMobile ? '90%' : '80%',
      height: this.isMobile ? '90%' : '95%',
      data: { transactionCab },
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

  onPeriodSelected(event: MatSelectChange) {
    this.selectedPeriodValue = event.value;
    console.log('Periodo seleccionado:', this.selectedPeriodValue);
    this.fetchTransactions(this.selectedPeriodValue);
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

    this.transactionService
      .getTransactionsRecords(startDate, endDate)
      .subscribe((transactions) => {
        this.loadingData = false;
        this.dataSource.data = transactions;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.paginator.pageSize = 20; // Define el número de elementos por página
        this.loadingTransactions = false;

        this.startDate = this.formatDate(startDate);
        this.endDate = this.formatDate(endDate);

        this.loadingData = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  valueDisabled(value: number | null | string): boolean {
    if (value == 0 || value == null || value == '') return false;
    return true;
  }

  setDisabled(id: string, currentValue: boolean) {
    const transactionSelected = this.dataSource.data.find(
      (transaction) => transaction.idregistrocab === +id,
    );
    if (transactionSelected) {
      transactionSelected.showSpinner = !transactionSelected.showSpinner;
    }

    this.loadingDisabledTransactions = true;
    const newValue = !currentValue;

    this.transactionService.setDisabled(id, newValue).subscribe(
      (transactionCab: TransactionCab) => {
        const updatedTransaccion = transactionCab;
        // Encuentra el índice de la transacción actualizada
        const index = this.dataSource.data.findIndex(
          (t) => t.idregistrocab === +id,
        );
        if (index !== -1) {
          // Actualiza el elemento en el dataSource
          this.dataSource.data[index].deshabilitado =
            updatedTransaccion.deshabilitado;
          // Actualiza la dataSource para reflejar los cambios en la vista
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.snackBar.open('Actualización exitosa', 'Entendido', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          if (transactionSelected) {
            transactionSelected.showSpinner = false;
          }
          this.changeDetectorRef.detectChanges();
        }
      },
      (error) => {
        console.error('Error updating transaction', error);
      },
    );
  }

  advancedSearch(){

    const startDateString = this.startDateAdvanced.value?.start;
    const endDateString = this.startDateAdvanced.value?.end;
    
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (startDateString) {
      startDate = new Date(startDateString);
      startDate.setHours(0, 0, 0, 0); // Establecer hora a 00:00:00
    }

    if (endDateString) {
      endDate = new Date(endDateString);
      endDate.setHours(23, 59, 59, 999); // Establecer hora a 23:59:59.999
    }

    const orden = this.order._control.value;
  
    this.transactionService
    .getTransactionsRecords(startDate!, endDate!, orden)
    .subscribe((transactions) => {
      this.dataSource.data = transactions;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;   
    });
  }

  enabledAdvancedSearch(){
    console.log(this.activeAdvancedSearch);
    this.activeAdvancedSearch = !this.activeAdvancedSearch;
  }

  cleanFilters(){
    this.order._control.value = '';
    this.startDateAdvanced._startInput.value = '';
    this.startDateAdvanced._endInput.value = '';
  }

  formatDate = (date: any) => {
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
