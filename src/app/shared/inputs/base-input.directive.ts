import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({})
export abstract class BaseInputDirective {

    @Input() label!: string;
    @Input() controlName!: string;
    @Input() controlNamePrefix!: string;
    @Input() form!: FormGroup;
    @Input() submitted: boolean = false;

    get f() {
        return this.form.get(this.controlName);
    }

    get fieldId(): string {
        return `${this.controlNamePrefix}_${this.controlName}`;
    }

    constructor() { }

    public getErrorMessage(key: string): string | null {
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
        }
        return message;
    }

}
