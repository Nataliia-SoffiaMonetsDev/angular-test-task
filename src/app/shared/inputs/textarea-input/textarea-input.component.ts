import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-textarea-input',
    templateUrl: './textarea-input.component.html',
    styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent {

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
