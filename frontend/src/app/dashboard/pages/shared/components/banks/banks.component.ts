import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { BankService } from './bank.service';
import { Bank } from './interfaces';
import { MaterialModule } from '../../../../../angular-material/material.module';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BanksComponent {
  public bancos: Bank[];

  private bankService = inject(BankService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.bankService.getBancos().subscribe(({ content: banks }) => {
      this.bancos = banks;
      this.changeDetectorRef.detectChanges();
    });
  }
}
