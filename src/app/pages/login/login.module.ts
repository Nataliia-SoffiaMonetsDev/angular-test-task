import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaInputComponent } from 'src/app/shared/inputs/textarea-input/textarea-input.component';
import { TextInputComponent } from 'src/app/shared/inputs/text-input/text-input.component';

@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputComponent,
        TextareaInputComponent
    ]
})
export class LoginModule { }