import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogoutResponse, UserData } from '../../shared/interfaces/data.interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthGraphQlService {

    constructor(private apollo: Apollo) { }

    public register(user: UserData): Observable<UserData> {
        const registrationMutation = gql
            `mutation RegisterUser($user: UserDto!) {
                register(user: $user) {
                    userName
                    email
                    password
                }
            }`;

        return this.apollo.mutate<{ register: UserData }>({
            mutation: registrationMutation,
            variables: {
                user: {
                    email: user.email,
                    password: user.password,
                    userName: user.userName,
                    token: ''
                }
            },
        }).pipe(map(result => result.data.register));
    }

    public login(user: UserData): Observable<UserData> {
        const loginMutation = gql
            `mutation LoginUser($user: UserDto!) {
                login(user: $user) {
                    userName
                    email
                    password
                    token
                }
            }`;

        return this.apollo.mutate<{ login: UserData }>({
            mutation: loginMutation,
            variables: {
                user: {
                    email: user.email,
                    password: user.password,
                    userName: '',
                    token: ''
                }
            },
        }).pipe(map(result => result.data.login));
    }

    public logout(): Observable<LogoutResponse> {
        const logoutMutation = gql
            `mutation LogoutUser {
                logout {
                    acknowledged
                    deletedCount
                }
            }`;

        return this.apollo.mutate<{ logout: LogoutResponse }>({
            mutation: logoutMutation,
        }).pipe(map(result => result.data.logout));
    }

    public getUsers(): Observable<UserData[]> {
        const getUsersQuery = gql
            `query GetUsers {
                users {
                    email
                    userName
                    password
                    token
                }
            }`;

        return this.apollo.query<{ users: UserData[] }>({
            query: getUsersQuery,
        }).pipe(map(result => result.data.users));
    }
}
