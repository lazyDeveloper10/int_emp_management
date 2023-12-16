export interface TableInterface {
    limit: number;
    page: number;
    pages: number;
    sortBy: any;
    total: number;
}

export interface TableItemsInterface {
    name: string;
    prop: string;
    flexGrow?: number | any;
    minWidth?: number | any;
    maxWidth?: number | any;
    draggable?: boolean | any;
    sortable?: boolean | any;
    headerClass?: string;
    cellClass?: string;
    dateFormat?: boolean;
    currencyFormat?: boolean;
    alignRight?: boolean;
}
