export interface ResponseBanks {
    info:    boolean;
    msg:     string;
    content: Bank[];
}

export interface Bank {
    codigo:      string;
    descripcion: string;
    disponible:  boolean;
}
