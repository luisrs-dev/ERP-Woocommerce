import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Transaction } from "../../../interfaces/transaction.interface";
import { MaterialModule } from "../../../../angular-material/material.module";
import { ClpCurrencyPipe } from "../../../../shared/pipes/clpCurrency.pipe";
import { UrlFormatPipe } from "../../../../shared/pipes/urlFormat.pipe";

@Component({
    selector: 'app-transaction-log-detail',
    standalone: true,
    imports: [CommonModule, MaterialModule, ClpCurrencyPipe, UrlFormatPipe],

    templateUrl: './transactionLogDetail.component.html',
    styleUrl: './transactionLogDetail.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionLogDetailComponent {
    public imgNotFound: string;
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: { transaction: Transaction },
    ) {
      this.imgNotFound = 'assets/images/not-found.jpg';
    }

 }
