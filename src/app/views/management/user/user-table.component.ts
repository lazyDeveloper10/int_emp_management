import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OverallUserResponseInterface, UserInterface, userTableColumns } from '../../../models';
import { ApiServices, managementApiService } from '../../../services';
import { SharedBaseModule, SharedFormModule, TableItemsInterface } from '../../../shared';
import { PageRequest } from '../../../utils';
import { AppTableComponent } from '../../../components/table';

@Component({
    standalone: true,
    imports: [ SharedBaseModule, SharedFormModule, AppTableComponent, ],
    template: `
        <app-table-component
            #table
            (onFetchData)="getUser($event)"
            (onCreateNew)="onAddNew()"
            (onUpdate)="onUpdate($event)"
            (onDelete)="onDelete($event)"
            [columns]="columns"
            [data]="data"
            [hasActionOptions]="true"
            [canCreateNew]="true"
            [canUpdate]="true"
            [canDelete]="true"
            headerTitle="User"
        ></app-table-component>
    `,
})
export class AppUserTableComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('table', { static: false }) table?: AppTableComponent;

    private ngUnsubscribe = new Subject();

    data?: OverallUserResponseInterface;
    group?: any[];

    totalData: any = 0;
    columns: TableItemsInterface[] = userTableColumns;

    constructor(
        private router: Router,
        private apiServices: ApiServices,
        private toasterService: ToastrService,
    ) {
    }

    ngOnInit() {
        // to handle pagination in table !! temporary no server !!
        this.apiServices.findAllService(managementApiService.user)
            .subscribe((response: UserInterface[]) => {
                this.totalData = response.length;
            });

        // to handle populate data !! temporary no server !!
        this.apiServices.findAllService(managementApiService.group)
            .subscribe((response: any) => {
                this.group = response;
            });
    }

    ngAfterViewInit() {
        this.table!.fetchData();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    getUser(event: PageRequest) {
        this.apiServices.findAllService(managementApiService.user, event)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => (this.table!.loadingStop()))
            )
            .subscribe((response: UserInterface[]) => {
                response.map((item: UserInterface) => {
                    item.groupName = this.group?.filter((group: any) => {
                        return item.groupId === group.id;
                    })[0].group;
                });

                this.data = {
                    value: response,
                    limit: event.size,
                    page: event.page,
                    pages: this.totalData / event.size === 0 ? 1 : Math.ceil(this.totalData / event.size),
                    sortBy: event.sort,
                    total: this.totalData,
                };
            });
    }

    onDelete(event: any) {
        this.apiServices.deleteOneService(managementApiService.user, event.id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                this.toasterService.error('Data Deleted', 'Error');

                this.table!.fetchData();
            });
    }

    async onAddNew() {
        await this.router.navigate([ `/management/user/create` ]);
    }

    async onUpdate(event: any) {
        await this.router.navigate([ `/management/user/update/${ event.id }` ]);
    }
}
