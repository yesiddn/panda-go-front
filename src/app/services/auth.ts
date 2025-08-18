import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterResponse, ResponseLogin, UserInfo } from '../models/auth.model';
import { RegisterRequest } from '../models/auth.model';
import { Token } from './token';
import { environment } from '../../environments/environment';
import { catchError, finalize, Observable, of, shareReplay, tap } from 'rxjs';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private tokenService = inject(Token);
  private userInfoRequest$: Observable<UserInfo> | null = null;
  apiURL = environment.API_URL;
  userInfo: UserInfo | null = null;

  login(username: string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiURL}/token/`, { username: username, password }).pipe(
      tap({
        next: (response) => {
          this.tokenService.saveToken(response.access);
          this.tokenService.saveRefreshToken(response.refresh);
        },
        error: (error) => {
          console.error('Error during login:', error);
        },
        complete: () => {
          console.log('Login request completed');
        }
      })
    );
  }

  register(payload: RegisterRequest) {
    // Ensure locality_id is a primitive id when sending to backend
    const body = {
      ...payload,
      locality_id: payload.locality_id && typeof payload.locality_id === 'object' ? (payload.locality_id as any).id : payload.locality_id
    };

    return this.http.post<RegisterResponse>(`${this.apiURL}/register/`, body);
  }

  refreshToken(refreshToken: string) {
    return this.http.post<ResponseLogin>(`${this.apiURL}/token/refresh/`, { refresh: refreshToken })
      .pipe(
        tap({
          next: (response) => {
            this.tokenService.saveToken(response.access);
          },
          error: (error) => {
            console.error('Error during login:', error);
          },
          complete: () => {
            console.log('Login request completed');
          }
        })
      );
  }

  logout() {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this.userInfo = null;
  }

  getUserInfo(forceRefresh = false) {
    // Si ya tenemos userInfo y no se fuerza refresh, devolvemos el cache inmediato
    if (this.userInfo && !forceRefresh) {
      return of(this.userInfo);
    }

    // Si ya hay una petición en curso, devolvemos su observable (dedupe concurrentes)
    if (this.userInfoRequest$ && !forceRefresh) {
      return this.userInfoRequest$;
    }

    // Crear la petición y compartir su resultado entre suscriptores
    const request$ = this.http
      .get<UserInfo>(`${this.apiURL}/me/`, { context: checkToken() })
      .pipe(
        tap({
          next: (userInfo) => {
            this.userInfo = userInfo; // guardar en cache
          },
          error: (error) => {
            console.error('Error fetching user info:', error);
          }
        }),
        // compartir el resultado con futuros suscriptores mientras la petición esté viva
        shareReplay({ bufferSize: 1, refCount: false }),
        // en caso de error, limpiar userInfoRequest$ para permitir reintentos
        catchError((err) => {
          this.userInfoRequest$ = null;
          throw err;
        }),
        finalize(() => {
          // Cuando la petición termine (éxito o error), liberamos el in-flight
          this.userInfoRequest$ = null;
        })
      );

    // Guardamos la referencia para que llamadas concurrentes reutilicen la misma petición
    this.userInfoRequest$ = request$;
    return request$;
  }
}
