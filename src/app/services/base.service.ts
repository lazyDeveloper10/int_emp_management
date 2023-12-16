import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constant } from '../../environments/constant';
import { PageRequest } from '../utils';

@Injectable({ providedIn: 'root' })
export class ApiServices {
    constructor(
        private http: HttpClient,
    ) {
    }

    findAllService(service: string, pagination?: PageRequest): Observable<any> {
        let request: string = constant.apiUrl + service;

        if (pagination?.page) {
            request += `?_page=${ pagination.page }&_limit=${ pagination.size }`;
        }

        if (pagination?.sort) {
            let [ sortBased, sortDirection ] = pagination.sort.split(',');

            request += `&_sort=${ sortBased }&_order=${ sortDirection }`;
        }

        return this.http.get<any>(request);
    }

    findByIdService(service: string, id: string): Observable<any> {
        return this.http.get<any>(constant.apiUrl + service + `/${ id }`);
    }

    createOneService(service: string, body: any): Observable<any> {
        return this.http.post<any>(constant.apiUrl + service, body);
    }

    updateOneService(service: string, id: any, body: any): Observable<any> {
        return this.http.put<any>(constant.apiUrl + service + `/${ id }`, body ? body : null);
    }

    inactiveOneService(service: string, id: string): Observable<any> {
        return this.http.delete<any>(constant.apiUrl + service + `/${ id }`);
    }

    deleteOneService(service: string, id: string): Observable<any> {
        return this.http.delete<any>(constant.apiUrl + service + `/${ id }`);
    }
}
