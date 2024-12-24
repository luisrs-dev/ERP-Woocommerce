import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatSelect } from '@angular/material/select';
import { MaterialModule } from '../../../../angular-material/material.module';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { MobileService } from '../../../../shared/services/mobile.service';
import { Filter } from '../../../interfaces/filters.interface';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule, LoaderComponent, SpinnerComponent],
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './advanced-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedFilterComponent implements OnInit {
  @ViewChild('moduloSelect') moduloSelect: MatSelect;
  @ViewChild('tipoSelect') tipoSelect: MatSelect;
  @ViewChild('banco') banco: MatSelect;
  @ViewChild('startDate') startDateInput: MatDateRangeInput<Date>;
  @ViewChild('endDate') endDateInput: MatDateRangeInput<Date>;
  @ViewChild('idTransaccion') idTransaccion: MatFormField;
  @ViewChild('nroOrden') nroOrden: MatFormField;

  @Output() filterApplied = new EventEmitter<any>();

  showLoader: boolean = false;
  public mobileService: MobileService;
  public isMobile: boolean;
  public storedFilters: Filter[];
  public moduleSelected:string;
  public typeSelected:string;
  public bankSelected:string;
  public idTransaction:string;
  public order:string;

  private datePipe = inject(DatePipe);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { bancos: any, tipos: any, modulos: any, filtros: Filter[] },
    
  ) {
    this.mobileService = inject(MobileService);
    this.storedFilters = data.filtros;
  }

  ngOnInit(): void {
    this.mobileService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
    this.moduleSelected = (this.data.filtros.find(filtro => filtro.name == 'modulo'))?.value || '';
    this.typeSelected = (this.data.filtros.find(filtro => filtro.name == 'tipo'))?.value || '';
    this.bankSelected = (this.data.filtros.find(filtro => filtro.name == 'banco'))?.value || '';
    this.idTransaction = (this.data.filtros.find(filtro => filtro.name == 'idTransaccion'))?.value || '';
    this.order = (this.data.filtros.find(filtro => filtro.name == 'nroOrden'))?.value || '';

  }

  applyFilter() {
    this.showLoader = true;

    setTimeout(() => {
      const moduloValue = this.moduloSelect ? this.moduloSelect.value : null;
      const tipoValue = this.tipoSelect ? this.tipoSelect.value : null;
      const banco = this.banco ? this.banco.value : null;
      const idTransaccion = this.idTransaccion ? this.idTransaccion._control.value : null;      
      const order = this.nroOrden ? this.nroOrden._control.value : null;      

      const startDateValue = this.startDateInput
        ? this.startDateInput.value
        : null;

      const formattedStartDate = startDateValue?.start
        ? this.datePipe.transform(startDateValue.start, 'yyyy-MM-dd')
        : null;
      const formattedEndDate = startDateValue?.end
        ? this.datePipe.transform(startDateValue.end, 'yyyy-MM-dd')
        : null;

      const filters: Filter[] = [
        { name: 'modulo', value: moduloValue },
        { name: 'tipo', value: tipoValue },
        { name: 'banco', value: banco },
        { name: 'startDate', value: formattedStartDate },
        { name: 'endDate', value: formattedEndDate },
        { name: 'idTransaccion', value: idTransaccion },
        { name: 'order', value: order },
      ];

      console.log({filters});
      

      this.filterApplied.emit(filters);
      this.showLoader = false;
    }, 100);
  }
}
