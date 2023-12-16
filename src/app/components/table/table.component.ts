import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

import { SharedBaseModule, SharedFormModule, TableItemsInterface } from '../../shared';

import { AppCardComponent } from '../card';

import { PageRequest, sortDatatable } from '../../utils';

@Component({
    standalone: true,
    selector: 'app-table-component',
    inputs: [
        'headerDisabled',
        'headerTitle',
        'canCreateNew',
        'data',
        'columns',
        'hasActionOptions',
        'canView',
        'canUpdate',
        'canDelete',
    ],
    outputs: [
        'onCreateNew',
        'onFetchData',
        'onView',
        'onUpdate',
        'onDelete',
    ],
    imports: [
        SharedBaseModule,
        SharedFormModule,
        AppCardComponent,
        NgxDatatableModule,
        AppCardComponent,
        NgSelectModule,
    ],
    template: `
        <app-card-component
                (onCreateNew)="onCreateNew.emit()"
                [headerDisabled]="headerDisabled"
                [headerTitle]="headerTitle"
                [canCreateNew]="canCreateNew"
        >
            <ng-content select="[topTable]"></ng-content>

            <ngx-datatable
                    #table
                    (page)="fetchData($event.offset + 1)"
                    (sort)="sortTable(page, $event); fetchData()"
                    [count]="totalElements"
                    [externalPaging]="true"
                    [externalSorting]="true"
                    [headerHeight]="70"
                    [footerHeight]="50"
                    [limit]="page.size"
                    [loadingIndicator]="loadingIndicator"
                    [offset]="offset"
                    [scrollbarH]="true"
                    [rows]="rows"
                    [columnMode]="columnMode"
                    rowHeight="auto"
                    class="material striped"
            >
                <!-- ============= responsive row detail ============= -->
                <ngx-datatable-row-detail [rowHeight]="'100%'">
                    <ng-template
                            let-row="row"
                            let-value="value"
                            let-expanded="true"
                            ngx-datatable-row-detail-template
                    >
                        <div style="font-size:14px">
                            <div *ngFor="let item of columns; let i = index" class="mt-2">
                                <ng-container *ngIf=" item.dateFormat || item.currencyFormat; else normal_value">
                                    <ng-container *ngIf="item.dateFormat">
                                        {{ item.name }}: {{ row[item.prop] | date: 'dd-MM-yyyy' }}
                                    </ng-container>

                                    <ng-container *ngIf="item.currencyFormat">
                                        {{ item.name }}: {{ row[item.prop] | currency:'':'' }}
                                    </ng-container>
                                </ng-container>

                                <ng-template #normal_value>
                                    {{ item.name }}: {{ row[item.prop] }}
                                </ng-template>
                            </div>

                            <!-- row responsive action -->
                            <div *ngIf="hasActionOptions" class="mt-2">
                                <ng-container>
                                    <button
                                            *ngIf="canView"
                                            (click)="onView.emit(row)"
                                            type="button"
                                            class="btn btn-success"
                                            style="margin-right: 10px"
                                    >
                                        <svg width="800px" height="800px" viewBox="0 0 1024 1024"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fill="#000000"
                                                  d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"/>
                                        </svg>
                                    </button>

                                    <button
                                            *ngIf=" canUpdate"
                                            (click)="onUpdate.emit(row)"
                                            type="button"
                                            class="btn btn-warning"
                                            style="margin-right: 10px"
                                    >
                                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                    d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                                    stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round"/>
                                            <path
                                                    d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                                    stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round"/>
                                        </svg>
                                    </button>

                                    <button
                                            *ngIf=" canDelete"
                                            (click)="onDelete.emit(row)"
                                            type="button"
                                            class="btn btn-danger"
                                    >
                                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M5.8662 8.15407C6.29365 8.16442 6.63173 8.5171 6.62131 8.94181L5.84735 8.92308L5.07338 8.90434C5.0838 8.47963 5.43876 8.14373 5.8662 8.15407ZM5.84735 8.92308C5.07338 8.90434 5.07338 8.90434 5.07338 8.90434L5.07235 8.94807L5.06956 9.07238C5.06721 9.18044 5.06396 9.33725 5.06034 9.53284C5.05312 9.92395 5.04446 10.4705 5.03868 11.0925C5.02716 12.333 5.02698 13.8865 5.07371 15.1062C5.12484 16.4402 5.26247 18.1669 5.37603 19.4527C5.50429 20.9048 6.73177 22 8.18698 22H15.813C17.2682 22 18.4957 20.9048 18.624 19.4527C18.7375 18.1669 18.8752 16.4402 18.9263 15.1062C18.973 13.8865 18.9728 12.333 18.9613 11.0925C18.9555 10.4705 18.9469 9.92395 18.9397 9.53284C18.936 9.33725 18.9328 9.18044 18.9304 9.07238L18.9277 8.94807L18.9266 8.90515C18.9162 8.48044 18.5612 8.14373 18.1338 8.15407C17.7063 8.16442 17.3683 8.5171 17.3787 8.94181L17.8719 8.92987C17.3787 8.94181 17.3787 8.94181 17.3787 8.94181L17.3797 8.98354L17.3824 9.10565C17.3847 9.2122 17.388 9.36732 17.3915 9.56106C17.3987 9.94862 17.4073 10.4903 17.413 11.1067C17.4245 12.3427 17.4243 13.8661 17.379 15.0477C17.3295 16.3412 17.1948 18.0358 17.0815 19.3182C17.0245 19.9641 16.4774 20.4615 15.813 20.4615H8.18698C7.52258 20.4615 6.97554 19.9641 6.91849 19.3182C6.80522 18.0358 6.67055 16.3412 6.62098 15.0477C6.5757 13.8661 6.57552 12.3427 6.587 11.1067C6.59273 10.4903 6.60132 9.94862 6.60847 9.56106C6.61205 9.36732 6.61527 9.2122 6.61759 9.10565L6.62032 8.98354L6.62131 8.94181L5.84735 8.92308Z"
                                                  fill="#030D45"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M4 5.84615C4 5.42132 4.34662 5.07692 4.77419 5.07692H19.2258C19.6534 5.07692 20 5.42132 20 5.84615C20 6.27099 19.6534 6.61539 19.2258 6.61539H4.77419C4.34662 6.61539 4 6.27099 4 5.84615Z"
                                                  fill="#030D45"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M8.25655 3.49321C8.7499 2.57411 9.71292 2 10.7613 2H13.2387C14.2871 2 15.2501 2.57411 15.7435 3.49321L16.8121 5.48416C17.0134 5.85902 16.8706 6.32497 16.4934 6.52489C16.1161 6.72481 15.6471 6.583 15.4459 6.20815L14.3772 4.21719C14.153 3.79942 13.7152 3.53846 13.2387 3.53846H10.7613C10.2848 3.53846 9.84702 3.79942 9.62277 4.21719L8.55408 6.20815C8.35287 6.583 7.88391 6.72481 7.50664 6.52489C7.12937 6.32497 6.98664 5.85902 7.18786 5.48416L8.25655 3.49321Z"
                                                  fill="#030D45"/>
                                        </svg>
                                    </button>
                                </ng-container>
                            </div>
                        </div>
                    </ng-template>
                </ngx-datatable-row-detail>

                <!-- row responsive arrow -->
                <ngx-datatable-column
                        [cellClass]="'d-lg-none'"
                        [draggable]="false"
                        [headerClass]="'d-lg-none'"
                        [sortable]="false"
                        [maxWidth]="50"
                >
                    <ng-template
                            let-row="row"
                            let-expanded="true"
                            ngx-datatable-cell-template
                    >
                        <a
                                (click)="table.rowDetail.toggleExpandRow(row)"
                                [class.datatable-icon-down]="expanded"
                                [class.datatable-icon-right]="!expanded"
                                title="Expand/Collapse Row"
                        >
                        </a>
                    </ng-template>
                </ngx-datatable-column>

                <!-- ============= row content ============= -->
                <ngx-datatable-column
                        *ngFor="let item of columns; let i = index"
                        [cellClass]="i !== 0  ? 'd-none d-lg-inline' : ''"
                        [headerClass]="i !== 0  ? 'd-none d-lg-inline' : ''"
                        [name]="item.name"
                        [prop]="item.prop"
                        [flexGrow]="item.flexGrow"
                        [minWidth]="item.minWidth"
                        [maxWidth]="item.maxWidth"
                        [sortable]="item.sortable"
                        [draggable]="item.draggable"
                >
                    <ng-template
                            let-value="value"
                            ngx-datatable-cell-template
                    >
                        <div *ngIf=" item.dateFormat || item.currencyFormat; else normal_value">
                            <div *ngIf="item.dateFormat" class="text-center">
                                {{ value | date: 'dd-MM-yyyy' }}
                            </div>

                            <div *ngIf="item.currencyFormat" class="table-align-right">
                                {{ value | currency:'':'' }}
                            </div>
                        </div>
                        <ng-template #normal_value>
                            <div class="text-center">{{ value }}</div>
                        </ng-template>
                    </ng-template>
                </ngx-datatable-column>

                <!-- ============= actions ============= -->
                <ngx-datatable-column
                        *ngIf="hasActionOptions"
                        [draggable]="false"
                        [sortable]="false"
                        [headerClass]="'d-none d-lg-inline'"
                        [cellClass]="'d-none d-lg-inline'"
                        [flexGrow]="1"
                        [minWidth]="300"
                        [maxWidth]="300"
                        name="Actions"
                >
                    <ng-template
                            let-expanded="true"
                            let-row="row"
                            let-rowIndex="rowIndex"
                            let-desc="row.ltrDesc"
                            ngx-datatable-cell-template
                    >
                        <button
                                *ngIf="canView"
                                (click)="onView.emit(row)"
                                size="sm"
                                type="button"
                                class="btn btn-success"
                                style="margin-right: 10px"
                        >
                            <svg width="800px" height="800px" viewBox="0 0 1024 1024"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill="#000000"
                                      d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"/>
                            </svg>
                        </button>

                        <button
                                *ngIf=" canUpdate"
                                (click)="onUpdate.emit(row)"
                                type="button"
                                class="btn btn-warning"
                                style="margin-right: 10px"
                        >
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                                        stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round"/>
                                <path
                                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                                        stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round"/>
                            </svg>
                        </button>

                        <button
                                *ngIf=" canDelete"
                                (click)="onDelete.emit(row)"
                                type="button"
                                class="btn btn-danger"
                        >
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M5.8662 8.15407C6.29365 8.16442 6.63173 8.5171 6.62131 8.94181L5.84735 8.92308L5.07338 8.90434C5.0838 8.47963 5.43876 8.14373 5.8662 8.15407ZM5.84735 8.92308C5.07338 8.90434 5.07338 8.90434 5.07338 8.90434L5.07235 8.94807L5.06956 9.07238C5.06721 9.18044 5.06396 9.33725 5.06034 9.53284C5.05312 9.92395 5.04446 10.4705 5.03868 11.0925C5.02716 12.333 5.02698 13.8865 5.07371 15.1062C5.12484 16.4402 5.26247 18.1669 5.37603 19.4527C5.50429 20.9048 6.73177 22 8.18698 22H15.813C17.2682 22 18.4957 20.9048 18.624 19.4527C18.7375 18.1669 18.8752 16.4402 18.9263 15.1062C18.973 13.8865 18.9728 12.333 18.9613 11.0925C18.9555 10.4705 18.9469 9.92395 18.9397 9.53284C18.936 9.33725 18.9328 9.18044 18.9304 9.07238L18.9277 8.94807L18.9266 8.90515C18.9162 8.48044 18.5612 8.14373 18.1338 8.15407C17.7063 8.16442 17.3683 8.5171 17.3787 8.94181L17.8719 8.92987C17.3787 8.94181 17.3787 8.94181 17.3787 8.94181L17.3797 8.98354L17.3824 9.10565C17.3847 9.2122 17.388 9.36732 17.3915 9.56106C17.3987 9.94862 17.4073 10.4903 17.413 11.1067C17.4245 12.3427 17.4243 13.8661 17.379 15.0477C17.3295 16.3412 17.1948 18.0358 17.0815 19.3182C17.0245 19.9641 16.4774 20.4615 15.813 20.4615H8.18698C7.52258 20.4615 6.97554 19.9641 6.91849 19.3182C6.80522 18.0358 6.67055 16.3412 6.62098 15.0477C6.5757 13.8661 6.57552 12.3427 6.587 11.1067C6.59273 10.4903 6.60132 9.94862 6.60847 9.56106C6.61205 9.36732 6.61527 9.2122 6.61759 9.10565L6.62032 8.98354L6.62131 8.94181L5.84735 8.92308Z"
                                      fill="#030D45"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M4 5.84615C4 5.42132 4.34662 5.07692 4.77419 5.07692H19.2258C19.6534 5.07692 20 5.42132 20 5.84615C20 6.27099 19.6534 6.61539 19.2258 6.61539H4.77419C4.34662 6.61539 4 6.27099 4 5.84615Z"
                                      fill="#030D45"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M8.25655 3.49321C8.7499 2.57411 9.71292 2 10.7613 2H13.2387C14.2871 2 15.2501 2.57411 15.7435 3.49321L16.8121 5.48416C17.0134 5.85902 16.8706 6.32497 16.4934 6.52489C16.1161 6.72481 15.6471 6.583 15.4459 6.20815L14.3772 4.21719C14.153 3.79942 13.7152 3.53846 13.2387 3.53846H10.7613C10.2848 3.53846 9.84702 3.79942 9.62277 4.21719L8.55408 6.20815C8.35287 6.583 7.88391 6.72481 7.50664 6.52489C7.12937 6.32497 6.98664 5.85902 7.18786 5.48416L8.25655 3.49321Z"
                                      fill="#030D45"/>
                            </svg>
                        </button>
                    </ng-template>
                </ngx-datatable-column>

                <!-- ============= FOOTER =============  -->
                <ngx-datatable-footer>
                    <ng-template
                            ngx-datatable-footer-template
                            let-rowCount="rowCount"
                            let-pageSize="pageSize"
                            let-selectedCount="selectedCount"
                            let-curPage="curPage"
                            let-offset="offset"
                    >

                        <div class="d-none d-sm-block" style="padding: 5px 10px">
                            <div>
                                Showing {{(offset * pageSize) + 1}}
                                to {{(rowCount > (curPage * pageSize)) ? (curPage * pageSize) : (rowCount)}}
                                of {{(rowCount)}} records.
                            </div>
                        </div>

                        <datatable-pager
                                [pagerLeftArrowIcon]="'datatable-icon-left'"
                                [pagerRightArrowIcon]="'datatable-icon-right'"
                                [pagerPreviousIcon]="'datatable-icon-prev'"
                                [pagerNextIcon]="'datatable-icon-skip'"
                                [page]="curPage"
                                [size]="pageSize"
                                [count]="rowCount"
                                [hidden]="!((rowCount / pageSize) > 1)"
                                (change)="table.onFooterPage($event)">
                        </datatable-pager>
                    </ng-template>
                </ngx-datatable-footer>
            </ngx-datatable>

            <div style="width: 75px; margin-top: 25px">
                <ng-select
                        (change)="sizeDatatable(page, $event)"
                        [ngModel]="page.size"
                        [items]="size"
                        bindValue="id"
                        bindLabel="size"
                ></ng-select>
            </div>
        </app-card-component>
    `
})
export class AppTableComponent {
    // header
    @Input() headerDisabled?: boolean = false;
    @Input() headerTitle?: string;
    @Input() canCreateNew?: boolean = false;

    // table
    @Input() data: any;
    @Input() columns!: TableItemsInterface[]; // table column
    @Input() hasActionOptions?: boolean;
    @Input() canView?: boolean;
    @Input() canUpdate?: boolean;
    @Input() canDelete?: boolean;

    // event
    @Output() onCreateNew = new EventEmitter<any>(true);
    @Output() onFetchData: EventEmitter<any> = new EventEmitter<any>();
    @Output() onView: EventEmitter<any> = new EventEmitter<any>();
    @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

    columnMode = ColumnMode.flex;
    loadingIndicator: boolean = true;
    page: PageRequest = new PageRequest();
    sortTable: Function = sortDatatable;
    size: any[] = [
        {
            id: 5,
            size: 5,
        },
        {
            id: 10,
            size: 10,
        },
        {
            id: 20,
            size: 20,
        }
    ];

    constructor(
        private cdr: ChangeDetectorRef,
    ) {
    }

    get offset(): number {
        return !!(this.data && this.data.page - 1) ? this.data.page - 1 : 0;
    }

    get rows(): any[] {
        return !!(this.data && this.data.value) ? this.data.value : [];
    }

    get totalElements(): number {
        return !!(this.data && this.data.total) ? this.data.total : 0;
    }

    sizeDatatable(page: PageRequest, event: any) {
        page.page = 1;
        page.size = event ? event.size : 10;

       this.fetchData();
    }

    fetchData(pageNumber: number = 1) {
        this.loadingIndicator = true;
        this.page.page = pageNumber;

        this.onFetchData.emit(this.page);
    }

    loadingStop() {
        this.loadingIndicator = false;
        this.cdr.detectChanges();
    }
}
