import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InfoModalComponent } from './info-modal.component';

describe('InfoModalComponent', () => {
    let component: InfoModalComponent;
    let fixture: ComponentFixture<InfoModalComponent>;
    let modalService: BsModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InfoModalComponent],
            providers: [BsModalService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoModalComponent);
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
        jest.spyOn(modalService, 'hide');
        component.openModal();
        setTimeout(() => {
            expect(modalService.show).toBeCalledWith(component.elementRef);
        }, 1000);
        setTimeout(() => {
            expect(modalService.hide).toBeCalled();
        }, 2500);
    });

    it('Hide modal', () => {
        modalService.show(component.elementRef);
        jest.spyOn(modalService, 'hide');
        component.hideModal();
        setTimeout(() => {
            expect(modalService.hide).toBeCalled();
        }, 1000);
    });

});