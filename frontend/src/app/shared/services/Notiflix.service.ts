import { Injectable } from '@angular/core';
import Notiflix from 'notiflix';

@Injectable({
  providedIn: 'root',
})
export class NotiflixService {
  constructor() {}

  success(message: string) {
    Notiflix.Notify.success(message);
  }

  error(message: string) {
    Notiflix.Notify.failure(message);
  }

  warning(message: string) {
    Notiflix.Notify.warning(message);
  }

  confirm(
    title: string,
    message: string,
    onOk: () => void,
    onCancel: () => void
  ) {
    Notiflix.Confirm.show(title, message, 'Sí', 'No', onOk, onCancel);
  }

  showLoading(message: string) {
    Notiflix.Loading.circle(message);
  }

  hideLoading() {
    Notiflix.Loading.remove();
  }

  // Bloqueo de Interfaz
  block(className: string, message: string = 'Cargando...') {
    Notiflix.Block.circle(`.${className}`, message); // Ajusta el selector según tu estructura
  }

  unblock(className: string) {
    Notiflix.Block.remove(`.${className}`); // Ajusta el selector según tu estructura
  }
}
