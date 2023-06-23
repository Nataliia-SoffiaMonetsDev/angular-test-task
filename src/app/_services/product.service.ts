import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductData } from '../shared/interfaces/data.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private resourceUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    public createProduct(body: ProductData): Observable<ProductData> {
        return this.http.post<ProductData>(`${this.resourceUrl}/products`, body);
    }

    public getAllProducts(): Observable<ProductData[]> {
        return this.http.get<ProductData[]>(`${this.resourceUrl}/products`);
    }

    public getProduct(id: string): Observable<ProductData> {
        return this.http.get<ProductData>(`${this.resourceUrl}/products/${id}`);
    }

    public updateProduct(body: ProductData): Observable<ProductData[]> {
        return this.http.put<ProductData[]>(`${this.resourceUrl}/products`, body);
    }

    public deleteProduct(id: string): Observable<ProductData[]> {
        return this.http.delete<ProductData[]>(`${this.resourceUrl}/products/${id}`);
    }
}
