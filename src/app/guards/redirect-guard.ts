import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Token } from '../services/token';

export const redirectGuard: CanActivateFn = (route, state) => {
  const isValidToken: string | unknown = inject(Token).isValidRefreshToken();
  if (isValidToken) {
    inject(Router).navigate(['/app']);
  }

  return true;
};
