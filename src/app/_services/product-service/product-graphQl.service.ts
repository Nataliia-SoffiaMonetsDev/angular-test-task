import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';

@Injectable({
    providedIn: 'root'
})
export class ProductGraphQlService {

    constructor(private apollo: Apollo) { }

    public createProduct(product: ProductData): Observable<ProductData> {
        const productCreationMutation = gql
            `mutation CreateProduct($product: ProductDto!) {
                createProduct(product: $product) {
                    name
                    description
                    _id
                }
            }`;

        return this.apollo.mutate<{ createProduct: ProductData }>({
            mutation: productCreationMutation,
            variables: {
                product: {
                    name: product.name,
                    description: product.description,
                }
            },
        }).pipe(map(result => result.data.createProduct));
    }

    public getAllProducts(): Observable<ProductData[]> {
        const getAllProductsQuery = gql
            `query GetAllProducts {
                getAllProducts {
                    name
                    description
                    _id
                }
            }`;

        return this.apollo.query<{ getAllProducts: ProductData[] }>({
            query: getAllProductsQuery,
        }).pipe(map(result => result.data.getAllProducts));
    }

    public getProduct(id: string): Observable<ProductData> {
        const getProductQuery = gql
            `query GetProduct($id: String!) {
                getProduct(id: $id) {
                    name
                    description
                    _id
                }
            }`;

        return this.apollo.query<{ getProduct: ProductData }>({
            query: getProductQuery,
            variables: {
                id: id
            }
        }).pipe(map(result => result.data.getProduct));
    }

    public updateProduct(product: ProductData): Observable<ProductData[]> {
        const productUpdateMutation = gql
            `mutation UpdateProduct($product: ProductInput!) {
                updateProduct(product: $product) {
                    name
                    description
                    _id
                }
            }`;

        return this.apollo.mutate<{ updateProduct: ProductData[] }>({
            mutation: productUpdateMutation,
            variables: {
                product: {
                    name: product.name,
                    description: product.description,
                    _id: product._id
                }
            },
        }).pipe(map(result => result.data.updateProduct));
    }

    public deleteProduct(id: string): Observable<ProductData[]> {
        const productDeleteMutation = gql
            `mutation DeleteProduct($id: String!) {
                deleteProduct(id: $id) {
                    name
                    description
                    _id
                }
            }`;

        return this.apollo.mutate<{ deleteProduct: ProductData[] }>({
            mutation: productDeleteMutation,
            variables: {
                id: id
            },
        }).pipe(map(result => result.data.deleteProduct));
    }

}
