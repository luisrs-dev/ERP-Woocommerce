import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../angular-material/material.module';
import { TransactionCab } from '../../../../interfaces/transaction.interface';
import { TransactionsService } from '../../transactions.service';

@Component({
  selector: 'app-transaction-log',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './TransactionLog.component.html',
  styleUrl: './TransactionLog.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionLogComponent {
  private transactionsService = inject(TransactionsService);
  public transactionsLogs: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { transactionCab: TransactionCab },
  ) {}

  ngOnInit(): void {
    this.transactionsService
      .getTransactionRecordLogs(this.data.transactionCab.transaccion)
      .subscribe((transactionsLogs) => {
        this.transactionsLogs = transactionsLogs;
      });
  }
}
