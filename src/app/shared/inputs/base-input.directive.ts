import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({})
export abstract class BaseInputDirective {

    @Input() label: string;
    @Input() controlName: string;
    @Input() controlNamePrefix: string;
    @Input() form: FormGroup;
    @Input() submitted: boolean = false;

    public get f() {
        return this.form.get(this.controlName);
    }

    public get fieldId(): string {
        return `${this.controlNamePrefix}_${this.controlName}`;
    }

    constructor() { }

    public getErrorMessage(key: string, error): string {
        let message = null;
        switch (key) {
            case 'required':
                message = '*This field is required';
                break;
            case 'email':
                message = '*Please enter valid email';
                break;
            case 'mustMatch':
                message = '*Passwords should match';
                break;
            case 'maxlength':
                message = `*Please enter maximum ${error.value.requiredLength} characters`;
                break;
            case 'minlength':
                message = `*Please enter minimum ${error.value.requiredLength} characters`;
                break;
        }
        return message;
    }

}
