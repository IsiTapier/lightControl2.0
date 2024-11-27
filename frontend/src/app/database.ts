import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

// export const ip = 'localhost';
// export const ip = '192.168.1.112';
export const ip = window.location.hostname;

export var requestError = false;
export var errorDetails : HttpErrorResponse; 

export function handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    requestError = true;
    errorDetails = error.error;
    window.alert("Datenbankfehler: Überprüfe die Verbindung und lade die Seite neu. \n\nError Details: "+error.message);
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }