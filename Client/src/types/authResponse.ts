export type AuthResponse = {
    accessToken: string;
    accountDetails: User;
};

export type User = {
    id: number;
    email: string;
    userName: string;
    phoneNumber: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    profilePicture: string;
    roles: string[];
};
