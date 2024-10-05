import { HttpParams, HttpResponse } from "@angular/common/http";
import { signal } from "@angular/core";
import { PaginationResult } from "../models/pagination";

export function setPaginatedResponse<T>(response: HttpResponse<T>, 
    paginatedResultSignal: ReturnType<typeof signal<PaginationResult<T> | null>>
){
    paginatedResultSignal.set({
          items: response.body as T,
          pagination: JSON.parse(response.headers.get('Pagination')!)
        })
  }

export function setPaginationHeaders(pageNumber: number, pageSize: number) {
    var params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber)
        .append('pageSize', pageSize);
    }
    return params;
  }