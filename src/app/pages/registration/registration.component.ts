import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from '../../shared/_validators/must-match.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
    form!: FormGroup;
    submitted: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: this.formBuilder.control(null, { validators: [Validators.required, Validators.email] }),
            password: this.formBuilder.control(null, { validators: Validators.required }),
            confirmPassword: this.formBuilder.control(null, { validators: Validators.required }),
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
    }

    public onSubmit(): void {
        if (!this.form.valid) {
            this.submitted = true;
            return;
        }
        console.log(this.form.value);
        this.router.navigate(['/login']);
    }
}
