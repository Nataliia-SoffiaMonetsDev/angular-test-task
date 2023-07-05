import { FormControl } from '@angular/forms';

export interface LoginForm {
    email: FormControl<string>;
    password: FormControl<string>;
}

export interface RegisterForm extends LoginForm {
    confirmPassword: FormControl<string>;
    userName: FormControl<string>;
}

export interface ProductForm {
    productName: FormControl<string>;
    productDescription: FormControl<string>;
    productId: FormControl<string>;
}