import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../../../angular-material/material.module';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { DateFormatPipe } from '../../../../../shared/pipes/DateFormat.pipe';
import { ClpCurrencyPipe } from '../../../../../shared/pipes/clpCurrency.pipe';
import { MobileService } from '../../../../../shared/services/mobile.service';
import {
  TransactionCab,
  TransactionRecord
} from '../../../../interfaces/transaction.interface';
import { TransactionsService } from './../../transactions.service';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ClpCurrencyPipe,
    DateFormatPipe,
    SpinnerComponent,
  ],
  templateUrl: './transactionDetail.component.html',
  styleUrl: './transactionDetail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDetailComponent {
  public imgNotFound: string;
  private transactionsService = inject(TransactionsService);
  public transctionsRecords: TransactionRecord[] = [];
  private changeDetectorRef = inject(ChangeDetectorRef);

  private mobileService = inject(MobileService);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);

  public isMobile: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { transactionCab: TransactionCab },
  ) {
    this.imgNotFound = 'assets/images/not-found.jpg';
  }

  ngOnInit(): void {
    this.mobileService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    this.transactionsService
      .getTransactionLogById(this.data.transactionCab.transaccion)
      .subscribe((transactions) => {
        this.transctionsRecords = transactions;
        this.transctionsRecords.sort(
          (a, b) => a.idlogtransaccion - b.idlogtransaccion,
        );
        this.changeDetectorRef.detectChanges();
      });
  }

  isImgNotFound(img: string) {
    return img.includes('not-found');
  }

  copyToClipboard(content: string) {
    this.clipboard.copy(content);
    this.snackBar.open(`Copiado: ${content}`, 'X', { duration: 2000 });
  }
}
