import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "./must-match.validator";

describe('MustMatchValidator', () => {
    let formGroup: FormGroup;

    beforeEach(() => {
        formGroup = new FormGroup({
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required)
        });
    });

    it('Should set "mustMatch" error', () => {
        formGroup.setValidators(MustMatch('password', 'confirmPassword'));
        formGroup.get('password').setValue('abcd1234');
        formGroup.get('confirmPassword').setValue('abcd12345');
        expect(formGroup.valid).toBe(false);
        expect(formGroup.get('confirmPassword').errors).toEqual({ mustMatch: true });
    });

    it('Should not set "mustMatch" error', () => {
        formGroup.setValidators(MustMatch('password', 'confirmPassword'));
        formGroup.get('password').setValue('abcd1234');
        formGroup.get('confirmPassword').setValue('abcd1234');
        expect(formGroup.valid).toBe(true);
        expect(formGroup.get('confirmPassword').errors).toBeNull();
    });

    it('Should set "mustNotMatch" error', () => {
        formGroup.setValidators(MustMatch('password', 'confirmPassword', true));
        formGroup.get('password').setValue('abcd1234');
        formGroup.get('confirmPassword').setValue('abcd1234');
        expect(formGroup.valid).toBe(false);
        expect(formGroup.get('confirmPassword').errors).toEqual({ mustNotMatch: true });
    });

    it('Should not set "mustNotMatch" error', () => {
        formGroup.setValidators(MustMatch('password', 'confirmPassword', true));
        formGroup.get('password').setValue('abcd1234');
        formGroup.get('confirmPassword').setValue('abcd12345');
        expect(formGroup.valid).toBe(true);
        expect(formGroup.get('confirmPassword').errors).toBeNull();
    });
});