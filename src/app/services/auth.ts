import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterResponse, ResponseLogin, UserInfo } from '../models/auth.model';
import { RegisterRequest } from '../models/auth.model';
import { Token } from './token';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private tokenService = inject(Token);
  apiURL = environment.API_URL;


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
  }

  getUserInfo() {
    return this.http.get<UserInfo>(`${this.apiURL}/me/`, { context: checkToken() });
  }
}
