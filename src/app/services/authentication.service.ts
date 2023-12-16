import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StorageServices } from '../services';
import { keystore } from '../shared';

@Injectable({ providedIn: 'root' })
export class AuthenticationServices {
    constructor(
        private http: HttpClient,
        private storageServices: StorageServices,
    ) {
    }

    // check token
    isAuthenticated(): boolean {
        const token = this.storageServices.getLocalStorage(keystore.accessToken);

        return !!token;
    }
}
