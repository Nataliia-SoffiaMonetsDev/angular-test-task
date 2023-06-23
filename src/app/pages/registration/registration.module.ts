import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationComponent } from './registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaInputComponent } from 'src/app/shared/inputs/textarea-input/textarea-input.component';
import { TextInputComponent } from 'src/app/shared/inputs/text-input/text-input.component';

@NgModule({
    declarations: [
        RegistrationComponent,
    ],
    imports: [
        CommonModule,
        RegistrationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputComponent,
        TextareaInputComponent
    ]
})
export class RegistrationModule { }