import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.status === 401) {
        errorMessage = 'Unauthorized access';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      } else {
        errorMessage = 'Uknown Error';
      }

      console.error('API Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
