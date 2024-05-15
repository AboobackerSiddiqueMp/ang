import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AddService {
  server_url = "https://test.initstore.com"


  constructor(private http: HttpClient) { }
  
  addemp(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<any>(`${this.server_url}/api/Order/PostChaiss`, data, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAllData(): Observable<any> {
    return this.http.get<any>(`${this.server_url}/api/Chai/GetItem`).pipe(
      catchError(this.handleError)
    );
  }
  getAllordrs(): Observable<any> {
    return this.http.get<any>(`${this.server_url}/api/Order/GetChaiss`).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }


}
