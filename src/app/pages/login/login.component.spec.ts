import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth-service/auth.service';
import { of, throwError } from 'rxjs';
import { UserData } from 'src/app/shared/interfaces/data.interfaces';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;
    const validUser = {
        email: "test@mail.com",
        password: "abCd1234!"
    };
    const userData = {
        "_id": "64a42b84ba332ad08a38045d",
        "email": "test@mail.com",
        "userName": "Name",
        "password": "$2b$05$5Ag5rjcSGMsy0zy6OZ1pBezJ5Ssm7/O6Y7ZfgcqOD4VwXfVhsDz36",
        "__v": 0,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTQyYjg0YmEzMzJhZDA4YTM4MDQ1ZCIsImVtYWlsIjoibmF0YUBtYWlsLmNvbSIsImlhdCI6MTY4OTE0NjU0OSwiZXhwIjoxNjg5MTg5NzQ5fQ.hh6Hyef7a7nYoWZUkO7bVxN8ikhBDckREx6uezWxfFU"
    };

    function updateForm(userEmail, userPassword) {
        component.form.controls['email'].setValue(userEmail);
        component.form.controls['password'].setValue(userPassword);
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent, FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

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
        jest.spyOn(component['router'], 'navigate');
        component.ngOnInit();
        expect(component['router'].navigate).toHaveBeenCalledWith(['/products']);
    });

    it('From should be invalid and submitted should be true if the user has not entered data', () => {
        component.logIn();
        expect(component.submitted).toBeTruthy();
        expect(component.form.invalid).toBeTruthy();
        expect(component.error).toBeUndefined();
    });

    it('Form value should update from when user changes the input', (() => {
        updateForm(validUser.email, validUser.password);
        expect(component.form.value).toEqual(validUser);
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
                fieldName: 'password',
                fieldValue: "a",
                error: 'minlength'
            },
            {
                fieldName: 'password',
                fieldValue: "aaaaaaaaaaaa",
                error: 'maxlength'
            }
        ];

        testCases.forEach(testCase => {
            it(`Field ${testCase.fieldName} validity`, () => {
                component.form.controls[testCase.fieldName].setValue(testCase.fieldValue);
                expect(component.form.get(testCase.fieldName).errors[testCase.error]).toBeTruthy();
                expect(component.form.invalid).toBeTruthy();
            });
        });
    });

    it('Should call authService.login() with form data on login()', () => {
        const loginData = jest.spyOn(authService, 'login').mockReturnValue(of({} as UserData));
        const email = 'email@mail.com';
        const password = 'password';
        updateForm(email, password);
        component.logIn();
        expect(loginData).toHaveBeenCalledWith({ email, password });
    });

    it('Successful login', () => {
        jest.spyOn(authService, 'login').mockReturnValue(of({} as UserData));
        const manageLocalStorage = jest.spyOn(authService, 'manageLocalStorage').mockImplementation();
        const isUserLoggedInSetData = jest.spyOn(authService.isUserLoggedIn, 'set').mockImplementation();
        jest.spyOn(component['router'], 'navigate');
        updateForm(validUser.email, validUser.password);
        component.logIn();
        expect(manageLocalStorage).toHaveBeenCalled();
        expect(isUserLoggedInSetData).toHaveBeenCalled();
        expect(component['router'].navigate).toHaveBeenCalledWith(['/products']);
    });

    it('Login failed', () => {
        jest.spyOn(authService, 'login').mockReturnValue(throwError('User does not exists'));
        const manageLocalStorage = jest.spyOn(authService, 'manageLocalStorage').mockImplementation();
        const isUserLoggedInSetData = jest.spyOn(authService.isUserLoggedIn, 'set').mockImplementation();
        jest.spyOn(component['router'], 'navigate');
        updateForm('email@mail.com', 'abcd1234');
        component.logIn();
        expect(manageLocalStorage).not.toHaveBeenCalled();
        expect(isUserLoggedInSetData).not.toHaveBeenCalled();
        expect(component['router'].navigate).not.toHaveBeenCalledWith(['/products']);
        expect(component.error).toBe('User does not exists');

        jest.spyOn(authService, 'login').mockReturnValue(throwError('Invalid password'));
        updateForm('test@mail.com', 'abcd1234');
        component.logIn();
        expect(manageLocalStorage).not.toHaveBeenCalled();
        expect(isUserLoggedInSetData).not.toHaveBeenCalled();
        expect(component['router'].navigate).not.toHaveBeenCalledWith(['/products']);
        expect(component.error).toBe('Invalid password');
    });

});
