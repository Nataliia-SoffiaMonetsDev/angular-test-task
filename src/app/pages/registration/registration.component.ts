import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../_validators/must-match.validator';
import { AuthService } from 'src/app/_services/auth-service/auth.service';
import { catchError, first, throwError } from 'rxjs';
import { RegisterForm } from 'src/app/shared/interfaces/forms.interfaces';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from 'src/app/shared/inputs/text-input/text-input.component';
import { TextareaInputComponent } from 'src/app/shared/inputs/textarea-input/textarea-input.component';
import { ApolloModule } from 'apollo-angular';
import { AuthGraphQlService } from 'src/app/_services/auth-service/auth-graphQl.service';

@Component({
    standalone: true,
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputComponent,
        TextareaInputComponent,
        ApolloModule
    ]
})
export class RegistrationComponent implements OnInit {

    public form: FormGroup;
    public submitted: boolean = false;
    public error: string;
    public get f() { return this.form.controls; };

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private authGraphService: AuthGraphQlService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group<RegisterForm>({
            email: this.formBuilder.control(null, { validators: [Validators.required, Validators.email] }),
            userName: this.formBuilder.control(null, Validators.required),
            password: this.formBuilder.control(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(10)] }),
            confirmPassword: this.formBuilder.control(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(10)] }),
        },
            {
                validators: [
                    MustMatch(
                        'password',
                        'confirmPassword',
                        false
                    )
                ]
            });
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/products']);
        }
    }

    public register(): void {
        if (!this.form.valid) {
            this.submitted = true;
            return;
        }
        const body: UserData = {
            email: this.f['email'].value,
            password: this.f['password'].value,
            userName: this.f['userName'].value
        };
        this.authGraphService.register(body).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
