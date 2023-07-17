import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseInputDirective } from './base-input.directive';

class TestInputDirective extends BaseInputDirective {
}

describe('BaseInputDirective', () => {
    let directive: TestInputDirective;
    let formGroup: FormGroup;

    beforeEach(() => {
        directive = new TestInputDirective();
        formGroup = new FormGroup({
            controlName: new FormControl('', Validators.required)
        });
        directive.form = formGroup;
        directive.controlName = 'controlName';
        directive.controlNamePrefix = 'controlNamePrefix';
    });

    it('Directive successfully created', () => {
        expect(directive).toBeTruthy();
    });

    it('Return the form control', () => {
        expect(directive.f).toBe(formGroup.get('controlName'));
    });

    it('Generate the correct fieldId', () => {
        expect(directive.fieldId).toBe('controlNamePrefix_controlName');
    });

    describe('Return the validation error message', () => {
        const testCases = [
            {
                key: 'required',
                error: '*This field is required'
            },
            {
                key: 'email',
                error: '*Please enter valid email'
            },
            {
                key: 'mustMatch',
                error: '*Passwords should match'
            },
            {
                key: 'maxlength',
                requiredLength: 6,
                error: '*Please enter maximum 6 characters'
            },
            {
                key: 'minlength',
                requiredLength: 2,
                error: '*Please enter minimum 2 characters'
            }
        ];
        testCases.forEach(testCase => {
            it(`${testCase.key} validity`, () => {
                let errorMessage;
                if (testCase.requiredLength) {
                    errorMessage = directive.getErrorMessage(testCase.key, {
                        value: {
                            requiredLength: testCase.requiredLength
                        }
                    });
                } else {
                    errorMessage = directive.getErrorMessage(testCase.key, {});
                }
                expect(errorMessage).toBe(testCase.error);
            });
        });
    });

});