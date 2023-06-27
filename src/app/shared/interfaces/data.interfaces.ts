export interface UserData {
    email: string;
    password: string;
    _id?: string;
    token?: string;
}

export interface ProductData {
    name: string;
    description: string;
    _id?: string;
}

export interface LogoutResponse {
    acknowledged: boolean
    deletedCount: number
}