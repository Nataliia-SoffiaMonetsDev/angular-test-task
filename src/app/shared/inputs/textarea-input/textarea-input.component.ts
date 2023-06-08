import { Component, OnInit } from '@angular/core';
import { BaseInputDirective } from '../base-input.directive';

@Component({
    selector: 'app-textarea-input',
    templateUrl: './textarea-input.component.html',
    styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent extends BaseInputDirective implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }
}
