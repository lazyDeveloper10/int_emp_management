import { FormControl, Validators } from '@angular/forms';

export class SignIn {
    username = new FormControl(null, Validators.required);
    password = new FormControl(null, Validators.required);
}

export interface SignInResultInterface {
    accessToken: string;
}

export interface SignInResponseInterface {
    value: SignInResultInterface;
}
