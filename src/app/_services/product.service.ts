import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private resourceUrl: string = 'http://localhost:5000/';

    constructor(private http: HttpClient) {
    }

    public createProduct(body: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}products`, body);
    }

    public getAllProducts(): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}products`);
    }

    public getProduct(id: string): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}products/${id}`);
    }

    public updateProduct(body: any): Observable<any> {
        return this.http.put<any>(`${this.resourceUrl}products`, body);
    }

    public deleteProduct(id: string): Observable<any> {
        return this.http.delete<any>(`${this.resourceUrl}products/${id}`);
    }
}
