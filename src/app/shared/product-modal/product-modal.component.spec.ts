import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProductModalComponent } from './product-modal.component';
import { ProductData } from '../interfaces/data.interfaces';

describe('InfoModalComponent', () => {
    let component: ProductModalComponent;
    let fixture: ComponentFixture<ProductModalComponent>;
    let modalService: BsModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductModalComponent, FormsModule, ReactiveFormsModule],
            providers: [BsModalService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductModalComponent);
        component = fixture.componentInstance;
        modalService = TestBed.inject(BsModalService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('Open modal', () => {
        jest.spyOn(modalService, 'show');
        component.openModal();
        setTimeout(() => {
            expect(modalService.show).toBeCalledWith(component.elementRef);
        }, 1000);
    });

    it('Open edit modal', () => {
        const productData: ProductData = {
            "_id": "64870f92e622309b8eaa38f6",
            "name": "Product 1",
            "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        };
        jest.spyOn(modalService, 'show');
        jest.spyOn(component, 'openModal');
        component.openEditModal(productData);
        setTimeout(() => {
            expect(component.openModal).toBeCalled();
            expect(modalService.show).toBeCalledWith(component.elementRef);
            expect(component.form.value).toEqual({
                productName: productData.name,
                productDescription: productData.description,
                productId: productData._id
            })
        }, 1000);
    });

    it('Hide modal', () => {
        modalService.show(component.elementRef);
        jest.spyOn(modalService, 'hide');
        component.hideModal();
        setTimeout(() => {
            expect(component.form.value).toEqual({
                productName: null,
                productDescription: null,
                productId: null
            });
            expect(component.submitted).toEqual(false);
            expect(component.error).toEqual('');
            expect(modalService.hide).toBeCalled();
        }, 1000);
    });

    it('Add product', () => {
        component.f['productName'].setValue('Product 1');
        component.f['productDescription'].setValue('Lorem ipsum dolor sit amet consectetur adipisicing elit.');
        jest.spyOn(component.onAddProduct, 'emit');
        component.addProduct();
        expect(component.onAddProduct.emit).toBeCalledWith({
            name: component.f['productName'].value,
            description: component.f['productDescription'].value,
            _id: component.f['productId'].value
        });
    });

    it('Edit product', () => {
        component.f['productName'].setValue('Product 10');
        component.f['productDescription'].setValue('Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.');
        component.f['productId'].setValue('64870f92e622309b8eaa38f6');
        jest.spyOn(component.onEditProduct, 'emit');
        component.editProduct();
        expect(component.onEditProduct.emit).toBeCalledWith({
            name: component.f['productName'].value,
            description: component.f['productDescription'].value,
            _id: component.f['productId'].value
        });
    });

    it('Get form value', () => {
        component.f['productName'].setValue('Product 10');
        component.f['productDescription'].setValue('Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.');
        component.f['productId'].setValue('64870f92e622309b8eaa38f6');
        const methodResult = component.getFormValue();
        expect(methodResult).toEqual({
            name: 'Product 10',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            _id: '64870f92e622309b8eaa38f6'
        });
    });

    describe('The form validity', () => {
        const testCases = [
            {
                fieldName: 'productName',
                fieldValue: "",
                error: 'required'
            },
            {
                fieldName: 'productName',
                fieldValue: "a",
                error: 'minlength'
            },
            {
                fieldName: 'productName',
                fieldValue: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                error: 'maxlength'
            },
            {
                fieldName: 'productDescription',
                fieldValue: "",
                error: 'required'
            },
            {
                fieldName: 'productDescription',
                fieldValue: "a",
                error: 'minlength'
            },
            {
                fieldName: 'productDescription',
                fieldValue: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis dolorem enim delectus odio doloremque repellat eveniet tempora perferendis repudiandae libero? Minima eligendi earum sed molestiae labore vero deleniti distinctio quia. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                error: 'maxlength'
            }
        ];

        testCases.forEach(testCase => {
            it(`Field ${testCase.fieldName} validity`, () => {
                component.form.controls[testCase.fieldName].setValue(testCase.fieldValue);
                expect(component.form.get(testCase.fieldName).errors[testCase.error]).toBeTruthy();
                expect(component.form.invalid).toBeTruthy();
            });
        });
    });

});