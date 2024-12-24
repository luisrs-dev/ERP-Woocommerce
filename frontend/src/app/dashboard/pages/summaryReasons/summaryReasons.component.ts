import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';
import { TransactionsService } from '../transactions/transactions.service';
import { DateRangePickerComponent } from '../../../shared/components/date-range-picker/date-range-picker.component';
import { TransactionCab } from '../../interfaces/transaction.interface';
import { MaterialModule } from '../../../angular-material/material.module';

interface MotivoCount {
  motivo: string;
  count: number;
}

@Component({
  selector: 'summary-reasons',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    DatePipe,
    DateRangePickerComponent,
    MaterialModule,
  ],
  providers: [DatePipe],
  templateUrl: './summaryReasons.component.html',
  styleUrl: './summaryReasons.component.css',
})
export default class SummaryReasonsComponent {
  public chart: Chart;
  public loadingTransactions: boolean = false;
  private transactionsService = inject(TransactionsService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  public startDate: Date;
  public endDate: Date;
  public selectedBanco: string | undefined = undefined;
  public bancos: string[] = ["Banco BCI", "Banco Santander","Banco Falabella","Banco Estado", "Banco Itaú", "Banco Chile"];

  ngOnInit() {
    // Inicialmente se buscan las transacciones del día
    this.startDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.endDate = new Date(new Date().setHours(23, 59, 59));
    this.loadTransactions();
  }

  loadTransactions() {
    this.loadingTransactions = true;    
    this.transactionsService
      .getTransactionsRecords(this.startDate, this.endDate, undefined, this.selectedBanco)
      .subscribe((transactions: TransactionCab[]) => {        
        const transaccionesConMotivo = transactions.filter(
          (t) => t.motivo_termino && t.motivo_termino != '',
        );
        const data = this.getMotivos(transaccionesConMotivo);
        const arrayMotivosUnicos = Array.from(data.motivosUnicos);
        const arrayCantidadPorMotivo = Array.from(data.motivosConCount);
        this.showChart(arrayMotivosUnicos, arrayCantidadPorMotivo);
        this.loadingTransactions = false;
        this.changeDetectorRef.detectChanges();
      },(error) => {
        console.log({error});
        this.loadingTransactions = false;
      }
    );
  }

  onDateRangeSelected(event: { startDate: Date | null; endDate: Date | null }) {
    this.loadingTransactions = true;
    this.startDate = event.startDate!;
    // Se setea endDate con hora 23:59:59 para considerar el día completo
    this.endDate = new Date(event.endDate!.setHours(23, 59, 59)); 
    this.loadTransactions();
  }

  getMotivos(transacciones: TransactionCab[]): {
    motivosUnicos: Set<string>;
    motivosConCount: MotivoCount[];
  } {
    const motivoCounts: { [key: string]: number } = {};

    // Iterar sobre las transacciones y contar motivo_termino
    transacciones.forEach((transaccion) => {
      if (transaccion.motivo_termino) {
        const motivo = transaccion.motivo_termino;
        if (motivoCounts[motivo]) {
          motivoCounts[motivo]++;
        } else {
          motivoCounts[motivo] = 1;
        }
      }
    });

    // Crear un Set con los motivos únicos
    const motivosUnicos = new Set<string>(Object.keys(motivoCounts));

    // Convertir el objeto de conteos a un array de { motivo, count }
    const motivosConCount: MotivoCount[] = Object.keys(motivoCounts).map(
      (motivo) => ({
        motivo,
        count: motivoCounts[motivo],
      }),
    );
    return { motivosUnicos, motivosConCount };
  }

  showChart(categories: string[], motivosCount: MotivoCount[]) {
    const seriesData = motivosCount.map((motivoCount) => ({
      name: motivoCount.motivo,
      y: motivoCount.count,
      color: '#0066ff',
    }));

    this.chart = new Chart({
      chart: {
        type: 'bar',
      },
      title: {
        text: 'Motivos de término de transacciones',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Transacciones',
        },
      },
      yAxis: {
        title: {
          text: 'N° Registros',
        },
        tickInterval: 1,
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

}
