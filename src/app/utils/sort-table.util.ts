import { PageRequest } from '../utils';

export function sortDatatable(pageRequest: PageRequest, event: any): PageRequest {
    pageRequest.page = 1;
    pageRequest.sort = `${ event.column.prop },${ event.newValue }`;

    return pageRequest;
}
