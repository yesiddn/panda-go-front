import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseLogin } from '../models/auth.model';
import { Token } from './token';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

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
}
