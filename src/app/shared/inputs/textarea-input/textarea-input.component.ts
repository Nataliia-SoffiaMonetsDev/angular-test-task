import { Component, OnInit } from '@angular/core';
import { BaseInputDirective } from '../base-input.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-textarea-input',
    templateUrl: './textarea-input.component.html',
    styleUrls: ['./textarea-input.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class TextareaInputComponent extends BaseInputDirective implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }
}
