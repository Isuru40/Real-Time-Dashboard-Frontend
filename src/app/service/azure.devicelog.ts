import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResponseFormat } from "../model/responseformat";

@Injectable({
  providedIn: 'root'
})
export class DevicelogService {

  private apiServer = "https://deviceregisterlog.azurewebsites.net/";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }


  getHumidityStatus(currentvalue): Observable<ResponseFormat> {
    return this.httpClient.get<ResponseFormat>(this.apiServer + 'api/HttpExample?humidity=' + currentvalue)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}