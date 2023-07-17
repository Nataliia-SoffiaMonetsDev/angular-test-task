import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

describe('InfoModalComponent', () => {
    let component: TextInputComponent;
    let fixture: ComponentFixture<TextInputComponent>;
    let formGroup: FormGroup;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TextInputComponent, FormsModule, ReactiveFormsModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextInputComponent);
        component = fixture.componentInstance;
        formGroup = new FormGroup({
            controlName: new FormControl('', Validators.required)
        });
        component.form = formGroup;
        component.controlName = 'controlName';
        component.controlNamePrefix = 'controlNamePrefix';
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.type).toEqual('text');
        expect(component.showIcon).toEqual(false);
    });

    it('Change input type to show or hide password', () => {
        component.type = 'password';
        component.showPassword();
        expect(component.type).toEqual('text');

        component.hidePassword();
        expect(component.type).toEqual('password');
    });

});