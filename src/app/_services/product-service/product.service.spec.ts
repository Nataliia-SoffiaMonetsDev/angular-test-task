import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { of } from 'rxjs';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('ProductService', () => {
    let productService: ProductService;
    let socket: Socket;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                SocketIoModule.forRoot(config)
            ],
            providers: [
                ProductService
            ],
        });

        productService = TestBed.inject(ProductService);
        socket = TestBed.inject(Socket);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('ProductService successfully created', () => {
        expect(productService).toBeDefined();
    });

    it('Create a new product', () => {
        const productData: ProductData = { name: 'Product 7', description: 'something' };
        productService.createProduct(productData).subscribe((product: ProductData) => {
            expect(product).toEqual(productData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/products`);
        expect(req.request.method).toEqual('POST');
        req.flush(productData);
    });

    it('Get all products', () => {
        const productsData: ProductData[] = [
            {
                "_id": "64870f92e622309b8eaa38f6",
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis dolorem enim delectus odio doloremque repellat eveniet tempora perferendis repudiandae libero? Minima eligendi earum sed molestiae labore vero deleniti distinctio quia."
            },
            {
                "_id": "64a56cadd76683a060ed99e9",
                "name": "Product 2",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis dolorem enim delectus odio doloremque repellat eveniet tempora perferendis repudiandae libero? Minima eligendi earum sed molestiae labore vero deleniti distinctio quia.",
            }
        ];
        productService.getAllProducts().subscribe((products: ProductData[]) => {
            expect(products).toEqual(productsData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/products`);
        expect(req.request.method).toEqual('GET');
        req.flush(productsData);
    });

    it('Get a certain product by id', () => {
        const productId = '64870f92e622309b8eaa38f6';
        const productData: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis dolorem enim delectus odio doloremque repellat eveniet tempora perferendis repudiandae libero? Minima eligendi earum sed molestiae labore vero deleniti distinctio quia."
        };
        productService.getProduct(productId).subscribe((product: ProductData) => {
            expect(product).toEqual(productData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/products/${productId}`);
        expect(req.request.method).toEqual('GET');
        req.flush(productData);
    });

    it('Update a certain product by id', () => {
        const productData: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        productService.updateProduct(productData).subscribe((products: ProductData[]) => {
            expect(products).toContain(productData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/products`);
        expect(req.request.method).toEqual('PUT');
        req.flush([productData]);
    });

    it('Delete a certain product by id', () => {
        const productData: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        productService.deleteProduct(productData._id).subscribe((products: ProductData[]) => {
            expect(products).not.toContain(productData);
        });
        const req = httpTestingController.expectOne(`${environment.apiUrl}/products/${productData._id}`);
        expect(req.request.method).toEqual('DELETE');
        req.flush([]);
    });

    it('Get new product with socket', () => {
        const productData: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        const event = of(productData);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        productService.getNewProductWithSocket().subscribe((product: ProductData) => {
            expect(product).toEqual(productData);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('newProduct');
    });

    it('Get updated products with socket', () => {
        const productsData: ProductData[] = [
            {
                "_id": "64870f92e622309b8eaa38f6",
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            }
        ];
        const updatedProductId = '64870f92e622309b8eaa38f6';
        const event = of([productsData, { updatedProductId }]);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        productService.getUpdatedProductWithSocket().subscribe((data: [ProductData[], { updatedProductId: string }]) => {
            expect(data[0]).toEqual(productsData);
            expect(data[1]).toEqual(updatedProductId);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('updatedProducts');
    });

    it('Get products after delete with socket', () => {
        const productsData: ProductData[] = [
            {
                "_id": "64870f92e622309b8eaa38f6",
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            }
        ];
        const deletedProductName = 'Product 1';
        const event = of([productsData, { deletedProductName }]);
        jest.spyOn(socket, 'fromEvent').mockReturnValue(event);
        productService.getProductAfterDeleteWithSocket().subscribe((data: [ProductData[], { deletedProductName: string }]) => {
            expect(data[0]).toEqual(productsData);
            expect(data[1]).toEqual(deletedProductName);
        });
        expect(socket.fromEvent).toHaveBeenCalledWith('productsAfterDelete');
    });

});