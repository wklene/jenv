import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { TokenInterceptor } from './modules/auth/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        // we declareren hier onze interceptor voor de authenticatie
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ]
};
