import { FormControl, Validators } from '@angular/forms';

import { TableInterface } from '../../shared';
import { ValidateEmail } from '../../utils';

export class User {
    firstName = new FormControl(null, Validators.required);
    lastName = new FormControl(null, Validators.required);
    username = new FormControl(null, Validators.required);
    status = new FormControl(null, Validators.required);
    birthdate = new FormControl(null, Validators.required);

    email = new FormControl(null, [ Validators.required, ValidateEmail ]);
    basicSalary = new FormControl(null, Validators.required);
    groupId = new FormControl(null, Validators.required);
    description = new FormControl(null, Validators.required);
}

export interface UserInterface {
    basicSalary: number;
    birthdate: Date;
    description: Date;
    email: string;
    firstName: string;
    groupName: string;
    groupId: string;
    id: string;
    lastName: string;
    status: string;
    username: string;
}

export interface OverallUserResponseInterface extends TableInterface {
    value: UserInterface[];
}

export const userTableColumns = [
    {
        name: 'First Name',
        prop: 'firstName',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: true,
    },
    {
        name: 'Last Name',
        prop: 'lastName',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: true,
    },
    {
        name: 'Username',
        prop: 'username',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: true,
    },
    {
        name: 'Email',
        prop: 'email',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: true,
    },
    {
        name: 'Birth Date',
        prop: 'birthdate',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: true,
        dateFormat: true,
    },
    {
        name: 'Salary (Rp)',
        prop: 'basicSalary',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: true,
        currencyFormat: true,
        alignRight: true,
    },
    {
        name: 'Group',
        prop: 'groupName',
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 250,
        draggable: false,
        sortable: false,
    },
];
