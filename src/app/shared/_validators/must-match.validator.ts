import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MustMatch(
    controlName: string,
    matchingControlName: string,
    mustNotMatch?: boolean
): any {
    return (formGroup: FormGroup): any => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return;
        }

        if (mustNotMatch && !control.value && !matchingControl.value) {
            return;
        }

        let valuesMatch = control.value === matchingControl.value;
        const isError = mustNotMatch ? valuesMatch : !valuesMatch;
        if (isError) {
            let error;

            if (!mustNotMatch) {
                error = { mustMatch: true };
            } else {
                error = { mustNotMatch: true };
            }

            matchingControl.setErrors(error);
        } else {
            matchingControl.setErrors(null);
        }
    }
}