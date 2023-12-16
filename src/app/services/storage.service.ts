import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageServices {
    getLocalStorage(key: string) {
        let item = localStorage.getItem(key);
        return item ? atob(item) : null;
    }

    setLocalStorage(key: string, value: string) {
        localStorage.setItem(key, btoa(value));
    }

    clearLocalStorage() {
        localStorage.clear();
    }
}
