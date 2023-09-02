import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LogUserService } from './log-user.service';
import { Router } from '@angular/router';
import { MusicApiService } from './music-api.service';

@Injectable()
export class ApiVerifyInterceptor implements HttpInterceptor {

  constructor(private _logUser:LogUserService,private router:Router,private musicService:MusicApiService) {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const newRequest=request.clone({
      headers:request.headers.set( 'Authorization', `Bearer ${localStorage.getItem("token")}`)});
      request.headers.set('Content-Type',`application/x-www-form-urlencoded`)
    return next.handle(newRequest).pipe(catchError((error:HttpErrorResponse)=>{
      let errmsg='';
      if (error.error instanceof ErrorEvent) {
        console.log('Client Side Error');
        errmsg=`Error :${error.error.message}`
      } else {
        if (error.status==401) {
        if ((localStorage.getItem('refresh_token')||'').length>=2) {
          this._logUser.refresh_token(localStorage.getItem('refresh_token')||'').subscribe({
            next:(res:any)=>{
              console.log(res);
              localStorage.setItem('token',res.access_token)
            },complete:()=>{              
              // localStorage.removeItem('refresh_token')
              this.musicService.logout();
            }
          })
          console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',error.status);
          // }
          // else{
            // localStorage.clear();
            // this.router.navigate(['/log-user'])
            // console.log('Server Side Error',error.status);
            // errmsg=`Error Code:${error.status},Message : ${error.message}`;
            // }
      }
      else{
        alert("Time Out Login Again")
        localStorage.clear();
        this.router.navigate(['/log-user'])
      }
    }
      }
      return throwError(() => new Error(errmsg))
    }))
  }
}
