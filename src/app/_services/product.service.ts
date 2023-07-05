import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductData } from '../shared/interfaces/data.interfaces';
import { environment } from 'src/environments/environment';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private resourceUrl: string = environment.apiUrl;

    constructor(private http: HttpClient, private socket: Socket) {
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

    public createProductWithSocket(body: ProductData): void {
        this.socket.emit('createProduct', body);
    }

    public getNewProductWithSocket(): Observable<ProductData> {
        return this.socket.fromEvent<ProductData>('newProduct');
    }

    public updateProductWithSocket(body: ProductData): void {
        this.socket.emit('updateProduct', body);
    }

    public getUpdatedProductWithSocket(): Observable<ProductData[]> {
        return this.socket.fromEvent<ProductData[]>('updatedProducts');
    }

    public deleteProductWithSocket(id: string): void {
        this.socket.emit('deleteProduct', id);
    }

    public getProductAfterDeleteWithSocket(): Observable<ProductData[]> {
        return this.socket.fromEvent<ProductData[]>('productsAfterDelete');
    }
}
