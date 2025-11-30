import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private readonly authService = inject(AuthService);

    // hier "intercepten" wij alle http requets en als we een access token hebben wordt deze meegegeven
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const accessToken = this.authService.getAccessToken();
        const authReq = accessToken ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }) : req;

        return next.handle(authReq).pipe(catchError((err) => this.handleAuthError(err)));
    }

    // afhandelen van errors, hier kunnen globaal forbidden of unauthorized call afgehandeld worden.
    //  zoals het redirecten van een pagina of uitloggen van de user, etc
    private handleAuthError(error: HttpErrorResponse) {
        return EMPTY;
    }
}
