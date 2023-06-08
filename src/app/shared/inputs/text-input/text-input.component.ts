import { Component, Input, OnInit } from '@angular/core';
import { BaseInputDirective } from '../base-input.directive';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent extends BaseInputDirective implements OnInit {

    @Input() type: string = 'text';
    @Input() showIcon: boolean = false;

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

    public showPassword(): void {
        this.type = 'text';
    }

    public hidePassword(): void {
        this.type = 'password';
    }
}
