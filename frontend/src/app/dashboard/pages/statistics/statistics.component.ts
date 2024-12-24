import { TransactionsLastWeekComponent } from './transactionsLastWeek/transactionsLastWeek.component';
import { Transactions24HrsComponent } from './transactions24Hrs/transactions24Hrs.component';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import { MaterialModule } from '../../../angular-material/material.module';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Transaction } from '../../interfaces/transaction.interface';
import { TransactionsService } from './../transactions/transactions.service';
import { BankTransactions } from './interfaces/bankTransactions.interface';
import { Stadistic } from './interfaces/statistic.interface';
import { TransactionsByBankComponent } from './transactionsByBank/transactionsByBank.component';
import BanksComponent from '../shared/components/banks/banks.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SpinnerComponent,
    BanksComponent,
    TransactionsByBankComponent,
    Transactions24HrsComponent,
    TransactionsLastWeekComponent
  ],
  templateUrl: './statistics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StatisticsComponent implements OnInit {
  public loadingStadistics: boolean;
  public lastWeekCounts: Stadistic[];

  public last24HoursCounts: Stadistic[];
  public transactionsByBank: any;
  public transactions: Transaction[];

  private transactionsService = inject(TransactionsService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadingStadistics = true;
    this.transactionsService.getTransactions().subscribe(({ transactions }) => {
      this.transactions = transactions;

      this.last24HoursCounts = this.last24HoursRecords();
      this.lastWeekCounts = this.lastWeekRecords();
      this.transactionsByBank = this.calculateTransactionsByBank();
      this.loadingStadistics = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  // Filtrar los registros de la última semana (excluyendo "Login")
  lastWeekRecords() {
    const transactionsLastWeek = this.transactions.filter((transaction) => {
      const date = new Date(transaction.fecha_alta);
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Hace una semana
      return date > lastWeek && transaction.tipo !== 'Login';
    });

    return this.groupByType(transactionsLastWeek);
  }

  last24HoursRecords(): Stadistic[] {
    const transactions24Hours = this.transactions.filter((transaction) => {
      const date = new Date(transaction.fecha_alta);
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000); // Hace 24 horas
      return date > last24Hours && transaction.tipo !== 'Login';
    });

    return this.groupByType(transactions24Hours);
  }

  groupByType(transactions: Transaction[]) {
    const tipos = [
      ...new Set(transactions.map((transaction) => transaction.tipo)),
    ];

    const countsByType: { tipo: string; valor: number }[] = []; // Arreglo para almacenar el tipo de transacción y su cantidad

    // Calcular la cantidad de transacciones de cada tipo
    tipos.forEach((tipo) => {
      const count = transactions.filter(
        (transaction) => transaction.tipo === tipo,
      ).length;
      countsByType.push({ tipo: tipo, valor: count });
    });

    return countsByType; // Devolver el arreglo de objetos
  }

  calculateTransactionsByBank(): BankTransactions[] {
    if (!this.transactions) return [];

    const transactionsByBankArray: { bank: string; transactions: number }[] = [];

    this.transactions
      .filter((transaction) => transaction.tipo !== 'Login')
      .filter((transaction) => transaction.banco !== '-')
      .forEach((transaction) => {
        const bank = transaction.banco;
        if (bank) {
          const index = transactionsByBankArray.findIndex(
            (item) => item.bank === bank,
          );
          if (index === -1) {
            transactionsByBankArray.push({ bank: bank, transactions: 1 });
          } else {
            transactionsByBankArray[index].transactions++;
          }
        }
      });

    transactionsByBankArray.sort((a, b) => b.transactions - a.transactions);

    return transactionsByBankArray;
  }
}
