import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, first, throwError } from 'rxjs';
import { AuthService } from 'src/app/_services/auth-service/auth.service';
import { TextInputComponent } from 'src/app/shared/inputs/text-input/text-input.component';
import { TextareaInputComponent } from 'src/app/shared/inputs/textarea-input/textarea-input.component';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';
import { LoginForm } from 'src/app/shared/interfaces/forms.interfaces';
import { CommonModule } from '@angular/common';
import { AuthGraphQlService } from 'src/app/_services/auth-service/auth-graphQl.service';

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextInputComponent,
        TextareaInputComponent
    ]
})
export class LoginComponent implements OnInit {
    
    public form: FormGroup;
    public submitted: boolean = false;
    public error: string;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private authGraphService: AuthGraphQlService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group<LoginForm>({
            email: this.formBuilder.control(null, { validators: [Validators.required, Validators.email] }),
            password: this.formBuilder.control(null, { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(10)] })
        });
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/products']);
        }
    }

    public logIn(): void {
        if (!this.form.valid) {
            this.submitted = true;
            return;
        }
        const body: UserData = this.form.getRawValue();
        this.authGraphService.login(body).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: UserData) => {
            this.authService.manageLocalStorage(data);
            this.authService.isUserLoggedIn.set(data);
            this.router.navigate(['/products']);
        });
    }
}
