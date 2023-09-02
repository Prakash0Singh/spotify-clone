import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogUserService {

  constructor(private http:HttpClient,private router:Router,private httpBackend: HttpBackend,) { }
  newHttpClient = new HttpClient(this.httpBackend);
  clientID='00ba17a75b5641aaba00ef7b581e7a0a';
  clientSecretID='f3195ce56491450895264c5c92710ca5'
  base='https://accounts.spotify.com/api/token'
  auth='https://accounts.spotify.com/authorize?'
  data=''
  scope= 
    'user-read-currently-playing ' +
    'user-top-read ' +
    'user-library-read ' +
    'user-follow-modify '+
    'user-read-private ' +
    'user-follow-read ' +
    'ugc-image-upload ' +
    'user-library-modify ' +
    'playlist-modify-private ' +
    'playlist-read-private ' +
    'playlist-modify-public ' +
    'user-modify-playback-state ' +
    'user-read-playback-state ' +
    'user-read-recently-played '+
    'app-remote-control ' +
    'streaming ' +
    'user-read-email'

  user_auth(){
    return this.data=`${this.auth}`+`client_id=${this.clientID}&`+`response_type=code&`+`redirect_uri=${encodeURI('http://localhost:4200/log-user')}&`+`scope=${this.scope}&` +`show_dialog=true`;
  }



  user_login(code:string){
    const scopes = [
      'user-read-playback-state',
      'user-modify-playback-state',
    ].join(" ");
      console.log(scopes);
    const data=new URLSearchParams();
    data.append('grant_type','authorization_code')
    data.append('code',code)
    data.append('scope',scopes)
    data.append('redirect_uri','http://localhost:4200/log-user')
    
    return this.newHttpClient.post(`${this.base}`,data,{headers:new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('00ba17a75b5641aaba00ef7b581e7a0a' + ':' + 'f3195ce56491450895264c5c92710ca5'),
    })})
  }

  refresh_token(token:string){
        
    const data=new URLSearchParams();
    data.append('grant_type','refresh_token')
    data.append('refresh_token',token)
    
    return this.newHttpClient.post(`${this.base}`,data,{headers:new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('00ba17a75b5641aaba00ef7b581e7a0a' + ':' + 'f3195ce56491450895264c5c92710ca5'),
    })})
  }

}
