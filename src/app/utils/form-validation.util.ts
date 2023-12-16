import { AbstractControl, FormGroup } from "@angular/forms";

export const isFieldInvalid = (form: FormGroup, field: string | Array<string>): boolean => {
    const fieldControl = form.get(field);
    return fieldControl!.invalid && (fieldControl!.dirty || fieldControl!.touched);
}

export function ValidateEmail(email: AbstractControl): any {
    if (email.value) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!emailRegex.test(email.value)) {
            return {emailFormat: true};
        }

        return null;
    }

    return;
}
