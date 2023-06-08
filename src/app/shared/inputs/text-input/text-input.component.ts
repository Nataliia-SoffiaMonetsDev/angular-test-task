import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent {

    @Input() type: string = 'text';
    @Input() label!: string;
    @Input() controlName!: string;
    @Input() controlNamePrefix!: string;
    @Input() form!: FormGroup;

    get f() {
        return this.form.get(this.controlName);
    }

    get fieldId(): string {
        return `${this.controlNamePrefix}_${this.controlName}`;
    }
}
