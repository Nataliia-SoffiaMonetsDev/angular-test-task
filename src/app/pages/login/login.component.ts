import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, first, throwError } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';
import { LoginForm } from 'src/app/shared/interfaces/forms.interfaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    
    public form: FormGroup;
    public submitted: boolean = false;
    public error: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
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
        this.authService.login(body).pipe(
            first(),
            catchError(error => {
                this.error = error;
                return throwError(error);
            })
        ).subscribe((data: UserData) => {
            this.authService.manageLocalStorage(data);
            this.authService.isUserLoggedIn.set(true);
            this.router.navigate(['/products']);
        });
    }
}
