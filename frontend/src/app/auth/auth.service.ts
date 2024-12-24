import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { User } from './interfaces/user.interface';
import { AuthStatus } from './interfaces/auth-status.enum';
import { LoginResponse } from './interfaces/login-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private router = inject(Router);
  private tokenTimer: any;

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private isAuthenticated: boolean = false;

  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(({ user, token, expiresIn }) => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        this.isAuthenticated = true;

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        this.saveAuthData(token, expirationDate, email);
        this.setAuthTimer(expiresIn);
      }),
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          // Error de conexión
          return throwError('No se pudo conectar al servidor.');
        } else if (error.status === 401 || error.status === 403) {
          // Error de autenticación
          return throwError('Credenciales incorrectas');
        } else {
          // Otros errores
          console.log(error);
          return throwError(
            'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
          );
        }
      }),
    );
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const user = localStorage.getItem('user');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user,
    };
  }

  private saveAuthData(token: string, expirationDate: Date, user: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('user', user);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();    
    if (!authInformation) return;
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.isAuthenticated = true;
      this._currentUser.set({ email: authInformation.user! });
    } else {
      this.logout();
      this.snackBar.open(`Sesión expirada`, 'Entendido', {duration: 3000});
    }
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.router.navigateByUrl('/login');
  }
}
