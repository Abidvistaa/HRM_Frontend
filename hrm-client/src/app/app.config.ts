import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
