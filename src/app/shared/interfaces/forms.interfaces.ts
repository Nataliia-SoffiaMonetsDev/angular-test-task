import { FormControl } from '@angular/forms';

export interface LoginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface RegisterForm extends LoginForm {
    confirmPassword: FormControl<string | null>;
}

export interface ProductForm {
    productName: FormControl<string | null>;
    productDescription: FormControl<string | null>;
    productId: FormControl<string | null>;
}