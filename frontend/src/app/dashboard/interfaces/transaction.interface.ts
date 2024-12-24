export interface Transaction {
  idlogtransaccion: number;
  transaccion: string;
  banco: string;
  tipo: string;
  modulo: string;
  mensaje: string;
  content: string;
  msg: null;
  img: string;
  fecha_alta: Date;
  url_retorno: string;
  monto: string;
  moneda: string;
  nro_transaccion: string;
}

export interface TransactionCab {
  idregistrocab: number;
  transaccion:   string;
  orden:         string;
  monto:         number;
  banco:         string;
  fecha:         string;
  estado:        string;
  modulo:        null;
  mensaje:       string;
  deshabilitado?: boolean;
  motivo_termino?: string;
  showSpinner?: boolean;
}

export interface TransactionRecord {
  idlogtransaccion: number;
  transaccion:      string;
  tipo:             string;
  modulo:           string;
  mensaje:          string;
  content:          string;
  banco:            string;
  img:              string;
  fecha_alta:       string;
  video: string|null;
}


export interface Module {
  modulo: string;
}

export interface TransactionFilter {
  modulo?: string;
  tipoValue?: string;
  idTransaccion?: string;
  startDate?: string;
  endDate?: string;
}


export interface ResponseTransactions{
  transactions: Transaction[],
  filters: any;
}