export type SecurityStatus = 'anonymous' | 'auto-signin' | 'loggedin';

interface Profile {
    email: string;
    fullName: string;
    id: string;
}
