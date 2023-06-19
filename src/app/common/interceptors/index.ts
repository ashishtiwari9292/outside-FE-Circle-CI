import { HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppInterceptor } from './app.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
  /* Add more here */
];