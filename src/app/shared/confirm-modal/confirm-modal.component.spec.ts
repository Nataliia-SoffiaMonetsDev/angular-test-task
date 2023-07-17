import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
    let component: ConfirmModalComponent;
    let fixture: ComponentFixture<ConfirmModalComponent>;
    let modalService: BsModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmModalComponent],
            providers: [BsModalService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmModalComponent);
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

    it('Hide modal', () => {
        component.openModal();
        jest.spyOn(modalService, 'hide');
        component.hideModal();
        setTimeout(() => {
            expect(modalService.hide).toBeCalled();
        }, 1000);
    });

    it('Confirm action', () => {
        component.openModal();
        jest.spyOn(component.onConfirm, 'emit');
        jest.spyOn(modalService, 'hide');
        component.confirmAction();
        setTimeout(() => {
            expect(component.onConfirm.emit).toHaveBeenCalled();
            expect(modalService.hide).toBeCalled();
        }, 1000);
    });

});
