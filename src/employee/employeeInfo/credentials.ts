import bcrypt from 'bcrypt';
import { time } from 'console';
import { LoginResponse } from '../../utilities/authenticateResponse';

export interface ICredentials {
    password: string;
    expires: Date;
    must_change: boolean;
    locked: boolean;
    bad_attempts: number;
    verified: Date;
    verification_token: string | null;
    tokenExpires: Date;
    reset_token: string | null;
}

export class Credentials implements ICredentials {
    public password: string;
    public expires: Date;
    public must_change: boolean;
    public locked: boolean;
    public bad_attempts: number;
    public verified: Date;
    public verification_token: string | null;
    public tokenExpires: Date;
    public reset_token: string | null;

    constructor(creds?: ICredentials) {
        if (creds) {
            this.password = creds.password;
            this.expires = creds.expires;
            this.must_change = creds.must_change;
            this.locked = creds.must_change;
            this.bad_attempts = creds.bad_attempts;
            this.verified = creds.verified;
            this.verification_token = creds.verification_token;
            this.tokenExpires = creds.tokenExpires;
            this.reset_token = creds.reset_token;
        } else {
            this.password = "";
            this.expires = new Date(0);
            this.must_change = false;
            this.locked = false;
            this.bad_attempts = 0;
            this.verified = new Date(0);
            this.verification_token = "";
            this.tokenExpires = new Date(0);
            this.reset_token = "";
        }
    }

    async Authenticate(passwd: string): Promise<LoginResponse> {
        const validpassword = await bcrypt.compare(passwd, this.password);
        let answer: LoginResponse = { status: 200, message: "Authorized"};
        if (validpassword) {
            if (this.locked) {
                answer = { status: 401, message: "Account Locked"};
                return answer;
            }
            if (this.bad_attempts > 2) {
                this.locked = true;
                answer = { status: 401, message:"Too Many Attempts, locked"};
                return answer;
            }
            if (this.verified.getTime() === 0) {
                answer = { status: 401, message:"Account Not verified"};
                return answer;
            }
            if (this.expires.getTime() < new Date().getTime()) {
                answer = { status: 401, message:"Password has expired"};
                return answer;
            }
            this.bad_attempts = 0;
            return answer;
        }
        this.bad_attempts++;
        if (this.bad_attempts > 2) {
            this.locked = true
        }
        answer = {status: 401, message: "Bad password"};
        return answer;
    }

    async SetPassword(newpasswd: string): Promise<boolean> {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(newpasswd, salt);
        let now = new Date();
        this.expires = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000))
        return true;
    }

    getToken(): string {
        let answer = Math.floor(Math.random() * 999999) + 1
        return Number(answer).toString().padStart(6, "0");
    }

    Verify(token: string): boolean {
        const now = new Date();
        if (token === this.verification_token 
            && now.getTime() < this.tokenExpires.getTime()) {
            this.verified = new Date();
            this.verification_token = '';
            this.tokenExpires = new Date(0);
            return true;
        }
        return false;
    }

    async ResetPassword(token: string, newPasswd: string): Promise<boolean> {
        if (token === this.reset_token 
            && new Date().getTime() < this.tokenExpires.getTime()) {
            this.reset_token = '';
            this.tokenExpires = new Date(0);
            await this.SetPassword(newPasswd);
            return true;
        }
        return false;
    }

    Unlock(): boolean {
        this.bad_attempts = 0;
        this.locked = false;
        return true;
    }
}