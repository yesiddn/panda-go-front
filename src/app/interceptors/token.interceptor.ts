import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../services/token';
import { Auth } from '../services/auth';
import { Observable, switchMap } from 'rxjs';

// es buena practica crear contextos para los tokens
const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  // se asigna el contexto
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectar todas las dependencias al inicio del interceptor
  const tokenService = inject(Token);
  const authService = inject(Auth);

  if (req.context.get(CHECK_TOKEN)) {
    const isValidToken = tokenService.isValidToken();
    if (isValidToken) {
      return addToken(req, next, tokenService);
    } else {
      return updateAccessTokenAndRefreshToken(req, next, tokenService, authService);
    }
  }
  return next(req);
};

// Función para agregar token - recibe dependencias como parámetros
const addToken = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: Token
): Observable<HttpEvent<any>> => {
  const accessToken = tokenService.getToken();

  if (accessToken) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return next(authRequest);
  }
  return next(req);
};

// Función para refrescar token - recibe dependencias como parámetros
const updateAccessTokenAndRefreshToken = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: Token,
  authService: Auth
): Observable<HttpEvent<any>> => {
  const refreshToken = tokenService.getRefreshToken();
  const isValidRefreshToken = tokenService.isValidRefreshToken();

  if (refreshToken && isValidRefreshToken) {
    return authService.refreshToken(refreshToken).pipe(
      switchMap(() => addToken(req, next, tokenService))
    );
  }
  return next(req);
};

