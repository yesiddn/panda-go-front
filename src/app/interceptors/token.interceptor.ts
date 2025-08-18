import {
  HttpContext,
  HttpContextToken,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { Token } from '../services/token';
import { Auth } from '../services/auth';

// es buena practica crear contextos para los tokens
const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  // se asigna el contexto
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(CHECK_TOKEN)) {
    const isValidToken = inject(Token).isValidToken();
    if (isValidToken) {
      return addToken(req, next);
    } else {
      updateAccessTokenAndRefreshToken(req, next);
    }
  }
  return next(req);
};

const addToken: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const accessToken = tokenService.getToken();

  if (accessToken) {
    // se clona el request y se le agrega el header de Authorization
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return next(authRequest);
  }
  return next(req);
}

const updateAccessTokenAndRefreshToken: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const refreshToken = tokenService.getRefreshToken();
  const isValidRefreshToken = tokenService.isValidRefreshToken();

  if (refreshToken && isValidRefreshToken) {
    const authService = inject(Auth);
    return authService.refreshToken(refreshToken)
      .pipe(
        switchMap(() => addToken(req, next))
      );
  }
  return next(req);
}
