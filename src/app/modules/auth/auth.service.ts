import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _token = 'MY TOKEN';
    // methode om in te loggen, we maken een call naar de backend met de credentials
    // we slaan bij result dan een bearer/jwt token op en een user object.
    login = (): void => {};

    // methode om uit te lgogen
    logout = (): void => {};

    // ophalen van de token gezet na inloggen
    getAccessToken = (): string => {
        return this._token;
    };
}
