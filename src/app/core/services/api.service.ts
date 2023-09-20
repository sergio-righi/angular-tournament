import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  // Modify the 'get' method to read JSON files
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    // Assuming your JSON files are stored in the 'assets' folder
    const jsonFile = `assets/${path}.json`;

    return this.http.get(jsonFile).pipe(
      catchError(this.formatErrors)
    );
  }

  // For 'put' and 'post' methods, you can save data to a JSON file
  // These methods are just examples and can be adjusted based on your needs
  put(path: string, body: Object = {}): Observable<any> {
    const jsonFile = `assets/${path}.json`;
    const data = JSON.stringify(body);

    // Here, you would write 'data' to the specified JSON file
    // You may need to use file-writing mechanisms provided by Angular or Node.js

    return this.http.put(jsonFile, data).pipe(
      catchError(this.formatErrors)
    );
  }

  post(path: string, body: Object = {}): Observable<any> {
    const jsonFile = `assets/${path}.json`;
    const data = JSON.stringify(body);

    // Here, you would write 'data' to the specified JSON file
    // You may need to use file-writing mechanisms provided by Angular or Node.js

    return this.http.post(jsonFile, data).pipe(
      catchError(this.formatErrors)
    );
  }

  // Modify the 'delete' method to delete data from a JSON file
  delete(path: string): Observable<any> {
    const jsonFile = `assets/${path}.json`;

    // Here, you would delete data from the specified JSON file
    // You may need to use file-deletion mechanisms provided by Angular or Node.js

    return this.http.delete(jsonFile).pipe(
      catchError(this.formatErrors)
    );
  }
}
