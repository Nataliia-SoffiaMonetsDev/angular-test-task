import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationComponent } from './registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth-service/auth.service';
import { of, throwError } from 'rxjs';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';

describe('RegistrationComponent', () => {
    let component: RegistrationComponent;
    let fixture: ComponentFixture<RegistrationComponent>;
    let authService: AuthService;
    const userData = {
        "_id": "64a42b84ba332ad08a38045d",
        "email": "nata@mail.com",
        "userName": "Nata",
        "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
        "__v": 0,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTE0NjU0OSwiZXhwIjoxNjg5MTg5NzQ5fQ.hh6Hyef7a7nYoWZUkO7bVxN8ikhBDckREx6uezWxfFU"
    }
    const newUser = {
        userName: 'Name',
        email: "unit@mail.com",
        password: "abcd1234",
        confirmPassword: "abcd1234"
    };
    const existingUser = {
        email: "nata@mail.com",
        password: "abCd1234!"
    };

    function updateForm(name, email, password, confirmPassword) {
        component.form.controls['userName'].setValue(name);
        component.form.controls['email'].setValue(email);
        component.form.controls['password'].setValue(password);
        component.form.controls['confirmPassword'].setValue(confirmPassword);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegistrationComponent, FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        fixture.detectChanges();
    })

    it('Component successfully created', () => {
        expect(component).toBeTruthy();
    });

    it('Component initial state', () => {
        expect(component.submitted).toBeFalsy();
        expect(component.form).toBeDefined();
        expect(component.error).toBeUndefined();
    });

    it('Should navigate to "/products" if user is already logged in', () => {
        jest.spyOn(authService, 'isLoggedIn').mockReturnValue(userData);
        jest.spyOn(component.router, 'navigate');
        component.ngOnInit();
        expect(component.router.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('Form value should update from when user changes the input', (() => {
        updateForm(newUser.userName, newUser.email, newUser.password, newUser.confirmPassword);
        expect(component.form.value).toEqual(newUser);
    }));

    describe('The form validity', () => {
        const testCases = [
            {
                fieldName: 'email',
                fieldValue: "",
                error: 'required'
            },
            {
                fieldName: 'email',
                fieldValue: "testmail.com",
                error: 'email'
            },
            {
                fieldName: 'userName',
                fieldValue: '',
                error: 'required'
            },
            {
                fieldName: 'password',
                fieldValue: '',
                error: 'required'
            },
            {
                fieldName: 'password',
                fieldValue: 'a',
                error: 'minlength'
            },
            {
                fieldName: 'password',
                fieldValue: "aaaaaaaaaaaa",
                error: 'maxlength'
            },
            {
                fieldName: 'confirmPassword',
                fieldValue: "abcd12345",
                error: 'mustMatch'
            }
        ];

        testCases.forEach(testCase => {
            it(`Field ${testCase.fieldName} validity`, () => {
                if (testCase.fieldName === 'confirmPassword') {
                    component.form.controls['password'].setValue('abcd1234');
                }
                component.form.controls[testCase.fieldName].setValue(testCase.fieldValue);
                expect(component.form.get(testCase.fieldName).errors[testCase.error]).toBeTruthy();
                expect(component.form.invalid).toBeTruthy();
            });
        });
    });

    it('Should call authService.register() with form data on register()', () => {
        const registerData = jest.spyOn(authService, 'register').mockReturnValue(of({} as UserData));
        const userName = 'Name'
        const email = 'email@mail.com';
        const password = 'password';
        const confirmPassword = 'password';
        updateForm(userName, email, password, confirmPassword);
        component.register();
        expect(registerData).toHaveBeenCalledWith({ userName, email, password });
    });

    it('Successful registration', () => {
        jest.spyOn(authService, 'register').mockReturnValue(of({} as UserData));
        jest.spyOn(component.router, 'navigate');
        updateForm(newUser.userName, newUser.email, newUser.password, newUser.confirmPassword);
        component.register();
        expect(component.router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('Registration failed', () => {
        jest.spyOn(authService, 'register').mockReturnValue(throwError('User already exists'));
        jest.spyOn(component.router, 'navigate');
        updateForm(newUser.userName, existingUser.email, newUser.password, newUser.confirmPassword);
        component.register();
        expect(component.router.navigate).not.toHaveBeenCalledWith(['/login']);
        expect(component.error).toBe('User already exists');
    });

});
