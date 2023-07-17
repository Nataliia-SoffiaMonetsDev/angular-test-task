import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from 'src/app/_services/product-service/product.service';
import { ProductsListComponent } from './products-list.component';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { of, throwError } from 'rxjs';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('ProductsListComponent', () => {
    let component: ProductsListComponent;
    let fixture: ComponentFixture<ProductsListComponent>;
    let productService: ProductService;
    let socket: Socket;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductsListComponent, HttpClientTestingModule, RouterTestingModule, SocketIoModule.forRoot(config)],
            providers: [ProductService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductsListComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService);
        socket = TestBed.inject(Socket);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('Component initial state', () => {
        expect(component.error).toBeUndefined();
        expect(component['productId']).toBeUndefined();
    });

    it('Delete product', () => {
        const productId: string = "64870f92e622309b8eaa38f6";
        jest.spyOn(component.confirmModalComponent, 'openModal');
        component.deleteProduct(productId);
        expect(component.confirmModalComponent.openModal).toHaveBeenCalled();
    });

    it('Confirmation of product delete', () => {
        const productId: string = "64870f92e622309b8eaa38f6";
        jest.spyOn(component.onProductDelete, 'emit');
        component['productId'] = productId;
        component.onConfirmProductDelete();
        expect(component.onProductDelete.emit).toHaveBeenCalledWith(component['productId']);
    });

    it('Navigate to product details', () => {
        const productId: string = "64870f92e622309b8eaa38f6";
        jest.spyOn(component['router'], 'navigate');
        component.navigateToProductDetails(productId);
        expect(component['router'].navigate).toHaveBeenCalledWith([`/product-details/${productId}`]);
    });

    it('Open edit modal', () => {
        const product: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        jest.spyOn(component.editProductModalComponent, 'openEditModal');
        component.openEditModal(product);
        expect(component.editProductModalComponent.openEditModal).toHaveBeenCalledWith(product);
    });

    it('Edit product', () => {
        const product: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        const existingProduct: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        component.products.push(existingProduct);
        jest.spyOn(component.editProductModalComponent, 'hideModal');
        jest.spyOn(productService, 'updateProduct').mockReturnValue(of({} as ProductData[]));
        component.editProduct(product);
        expect(productService.updateProduct).toHaveBeenCalledWith(product);
        expect(component.editProductModalComponent.hideModal).toHaveBeenCalled();
    });

    it('Should not edit product if no changes made', () => {
        const product: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        const existingProduct: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        component.products.push(existingProduct);
        jest.spyOn(component.editProductModalComponent, 'hideModal');
        jest.spyOn(productService, 'updateProduct');
        component.editProduct(product);
        expect(productService.updateProduct).not.toHaveBeenCalled();
        expect(component.editProductModalComponent.hideModal).toHaveBeenCalled();
    });

    it('Handle error when updating product', () => {
        const product: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        const existingProduct: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        component.products.push(existingProduct);
        const error = 'Product does not exists';
        jest.spyOn(component.editProductModalComponent, 'hideModal');
        jest.spyOn(productService, 'updateProduct').mockReturnValue(throwError(error));
        component.editProduct(product);
        expect(productService.updateProduct).toHaveBeenCalledWith(product);
        expect(component.editProductModalComponent.hideModal).not.toHaveBeenCalled();
        expect(component.error).toEqual(error);
    });

});
