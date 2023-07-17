import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from 'src/app/_services/product-service/product.service';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MessagesData, ProductData } from 'src/app/shared/interfaces/data.interfaces';
import { of } from 'rxjs';
import { ChatService } from 'src/app/_services/chat-service/chat.service';
import { ProductsPageComponent } from './products-page.component';

const config: SocketIoConfig = { url: environment.apiUrl, options: {} }

describe('ProductsPageComponent', () => {
    let component: ProductsPageComponent;
    let fixture: ComponentFixture<ProductsPageComponent>;
    let productService: ProductService;
    let chatService: ChatService;
    let socket: Socket;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductsPageComponent, HttpClientTestingModule, RouterTestingModule, SocketIoModule.forRoot(config)],
            providers: [ProductService, ChatService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductsPageComponent);
        component = fixture.componentInstance;
        productService = TestBed.inject(ProductService);
        chatService = TestBed.inject(ChatService);
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
        expect(component.products).toEqual([]);
        expect(component.error).toBeDefined();
        expect(component.modalInfoText).toBeUndefined();
        expect(component.showMessage).toEqual(false);
        expect(component['currentMessage']).toBeUndefined();
    });

    it('Open product modal', () => {
        jest.spyOn(component.addProductModalComponent, 'openModal');
        component.openProductModal();
        expect(component.addProductModalComponent.openModal).toHaveBeenCalled();
    });

    it('Delete product', () => {
        const productId: string = "64870f92e622309b8eaa38f6";
        jest.spyOn(productService, 'deleteProduct').mockReturnValue(of({} as ProductData[]));
        component.deleteProduct(productId);
        expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
        expect(component.error).toEqual('');
    });

    it('Add product', () => {
        const productData: ProductData = {
            "name": "Product 10",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        jest.spyOn(productService, 'createProduct').mockReturnValue(of(productData as ProductData));
        jest.spyOn(component.addProductModalComponent, 'hideModal');
        component.addProduct(productData);
        expect(productService.createProduct).toHaveBeenCalledWith(productData);
        expect(component.addProductModalComponent.hideModal).toHaveBeenCalled();
        expect(component.error).toEqual('');
    });

    it('Get all products', () => {
        const productsData: ProductData[] = [
            {
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            },
            {
                "name": "Product 2",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            }
        ];
        jest.spyOn(productService, 'getAllProducts').mockReturnValue(of(productsData as ProductData[]));
        component.getAllProducts();
        expect(productService.getAllProducts).toHaveBeenCalled();
        expect(component.error).toEqual('');
        expect(component.products).toEqual(productsData);
        expect(component.loading()).toBe(false);
    });

    it('Get new product with socket', () => {
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

    it('Get products after delete', () => {
        const productsData: ProductData[] = [
            {
                "_id": "64870f92e622309b8eaa38f6",
                "name": "Product 1",
                "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
            }
        ];
        const deletedProductName = 'Product 1';
        jest.spyOn(productService, 'getProductAfterDeleteWithSocket').mockReturnValue(of([productsData, { deletedProductName }]));
        jest.spyOn(component.productInfoModal, 'openModal');
        component.getProductAfterDeleteWithSocket();
        expect(productService.getProductAfterDeleteWithSocket).toHaveBeenCalled();
        expect(component.modalInfoText).toEqual(`Product '${deletedProductName}' has been deleted.`);
        expect(component.products).toEqual(productsData);
        expect(component.productInfoModal.openModal).toHaveBeenCalled();
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
        jest.spyOn(productService, 'getUpdatedProductWithSocket').mockReturnValue(of([productsData, { updatedProductId }]));
        jest.spyOn(component.productInfoModal, 'openModal');
        component.getUpdatedProductWithSocket();
        expect(productService.getUpdatedProductWithSocket).toHaveBeenCalled();
        expect(component.products).toEqual(productsData);
        expect(component.modalInfoText).toEqual(`Product '${productsData[0].name}' has been updated.`);
        expect(component.productInfoModal.openModal).toHaveBeenCalled();
    });

    it('Get new message', () => {
        const messageData: MessagesData = {
            date: '7 Jul 3:11 PM',
            message: 'message',
            userName: 'Name',
        }
        jest.spyOn(chatService, 'getExternalUserMessage').mockReturnValue(of(messageData));
        component['getNewMessage']();
        expect(chatService.getExternalUserMessage).toHaveBeenCalled();
        expect(component['currentMessage']).toEqual(messageData);
        expect(component.showMessage).toEqual(true);
        setTimeout(() => {
            expect(component.showMessage).toEqual(false);
        }, 2500);
    });

});
