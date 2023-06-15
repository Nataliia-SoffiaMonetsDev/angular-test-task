import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    
    public form!: FormGroup;
    public submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: this.formBuilder.control(null, { validators: [Validators.required, Validators.email] }),
            password: this.formBuilder.control(null, { validators: Validators.required })
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
        const body = this.form.getRawValue();
        this.authService.login(body).pipe(first()).subscribe(data => {
            this.authService.manageSessionStorage(data);
            this.authService.isLoggedInSubject.next(true);
            this.router.navigate(['/products']);
        });
    }
}
