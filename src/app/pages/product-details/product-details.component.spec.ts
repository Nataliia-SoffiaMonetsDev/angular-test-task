import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from 'src/app/_services/product-service/product.service';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MessagesData, ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { of, throwError } from 'rxjs';
import { ProductDetailsComponent } from './product-details.component';
import { ChatService } from 'src/app/_services/chat-service/chat.service';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('ProductDetilsComponent', () => {
    let component: ProductDetailsComponent;
    let fixture: ComponentFixture<ProductDetailsComponent>;
    let productService: ProductService;
    let chatService: ChatService;
    let socket: Socket;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductDetailsComponent, HttpClientTestingModule, RouterTestingModule, SocketIoModule.forRoot(config)],
            providers: [ProductService, ChatService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductDetailsComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService);
        chatService = TestBed.inject(ChatService);
        socket = TestBed.inject(Socket);
        fixture.detectChanges();
    });

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('Component initial state', () => {
        expect(component.product).toBeUndefined();
        expect(component.error).toBeDefined();
        expect(component.modalInfoText).toBeUndefined();
        expect(component.showMessage).toEqual(false);
        expect(component.currentMessage).toBeUndefined();
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

    it('Delete product', () => {
        const productId: string = "64870f92e622309b8eaa38f6";
        component.productId = productId;
        jest.spyOn(productService, 'deleteProduct').mockReturnValue(of({} as ProductData[]));
        jest.spyOn(component.router, 'navigate');
        component.deleteProduct();
        expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
        expect(component.router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('Delete product failed', () => {
        const error = 'Failed to delete product';
        const productId: string = "64870f92e622309b8eaa38f6";
        component.productId = productId;
        jest.spyOn(productService, 'deleteProduct').mockReturnValue(throwError(error));
        jest.spyOn(component.router, 'navigate');
        component.deleteProduct();
        expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
        expect(component.router.navigate).not.toHaveBeenCalledWith(['/products']);
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
        component.product = existingProduct;
        jest.spyOn(component.editProductModalComponent, 'hideModal');
        jest.spyOn(productService, 'updateProduct').mockReturnValue(of({} as ProductData[]));
        component.editProduct(product);
        expect(productService.updateProduct).toHaveBeenCalledWith(product);
        setTimeout(() => {
            expect(component.editProductModalComponent.hideModal).toHaveBeenCalled();
        }, 1000);
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
        component.product = existingProduct;
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
        component.product = existingProduct;
        const error = 'Product does not exists';
        jest.spyOn(component.editProductModalComponent, 'hideModal');
        jest.spyOn(productService, 'updateProduct').mockReturnValue(throwError(error));
        component.editProduct(product);
        expect(productService.updateProduct).toHaveBeenCalledWith(product);
        expect(component.editProductModalComponent.hideModal).not.toHaveBeenCalled();
        expect(component.error).toEqual(error);
    });

    it('Get product', () => {
        const productData = {
            _id: '64870f92e622309b8eaa38f6',
            name: 'Product 1',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        };
        component.productId = productData._id;
        jest.spyOn(productService, 'getProduct').mockReturnValue(of(productData as ProductData));
        component.getProduct();
        expect(productService.getProduct).toHaveBeenCalledWith(component.productId);
        expect(component.product).toEqual(productData);
        expect(component.loading()).toBe(false);
    });

    it('Get updated product with socket', () => {
        const productsData: ProductData[] = [
            {
                "_id": "64870f92e622309b8eaa38f6",
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            }
        ];
        const updatedProductId = '64870f92e622309b8eaa38f6';
        component.productId = updatedProductId;
        jest.spyOn(productService, 'getUpdatedProductWithSocket').mockReturnValue(of([productsData, { updatedProductId }]));
        jest.spyOn(component.productInfoModal, 'openModal');
        component.getUpdatedProductWithSocket();
        expect(productService.getUpdatedProductWithSocket).toHaveBeenCalled();
        expect(component.product).toEqual(productsData.find((product: ProductData) => product._id === updatedProductId));
        expect(component.modalInfoText).toEqual(`Product '${productsData.find((product: ProductData) => product._id === updatedProductId).name}' has been updated.`);
        expect(component.productInfoModal.openModal).toHaveBeenCalled();
    });

    it('Get products after delete', () => {
        const productsData: ProductData[] = [
            {
                "_id": "64870f92e622309b8eaa38f6",
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            }
        ];
        component.product = productsData[0];
        const deletedProductName = 'Product 1';
        jest.spyOn(productService, 'getProductAfterDeleteWithSocket').mockReturnValue(of([productsData, { deletedProductName }]));
        jest.spyOn(component.productInfoModal, 'openModal');
        jest.spyOn(component.router, 'navigate');
        component.getProductAfterDeleteWithSocket();
        expect(productService.getProductAfterDeleteWithSocket).toHaveBeenCalled();
        expect(component.modalInfoText).toEqual(`Product '${deletedProductName}' has been deleted.`);
        expect(component.productInfoModal.openModal).toHaveBeenCalled();
        setTimeout(() => {
            expect(component.router.navigate).not.toHaveBeenCalledWith(['/products']);
        }, 1500);
    });

    it('Get new product', () => {
        const productData: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        jest.spyOn(productService, 'getNewProductWithSocket').mockReturnValue(of(productData));
        jest.spyOn(component.productInfoModal, 'openModal');
        component.getNewProductWithSocket();
        expect(productService.getNewProductWithSocket).toHaveBeenCalled();
        expect(component.modalInfoText).toEqual(`Product '${productData.name}' has been added.`);
        expect(component.productInfoModal.openModal).toHaveBeenCalled();
    });

    it('Get new message', () => {
        const messageData: MessagesData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        }
        jest.spyOn(chatService, 'getExternalUserMessage').mockReturnValue(of(messageData));
        component.getNewMessage();
        expect(chatService.getExternalUserMessage).toHaveBeenCalled();
        expect(component.currentMessage).toEqual(messageData);
        expect(component.showMessage).toEqual(true);
        setTimeout(() => {
            expect(component.showMessage).toEqual(false);
        }, 2500);
    });

});
