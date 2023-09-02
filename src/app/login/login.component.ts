import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogUserService } from '../service/log-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  code='';

  constructor(private activerouter:ActivatedRoute,private router:Router,private _authUser:LogUserService){}
  
  CLIENT_ID='00ba17a75b5641aaba00ef7b581e7a0a';
  REDIRECT_URI='http://localhost:4200/log-user';

  ngOnInit(): void {

    this.code = this.activerouter.snapshot.queryParamMap.get('code') || '';
    if (localStorage.getItem("token")) {
      this.router.navigate([''])
    }

    if (this.code) {

      console.log(this.code);
      localStorage.clear();
      this._authUser.user_login(this.code).subscribe({
        next:(res:any)=>{
          console.log(res);
          document.cookie=`token=${res.access_token};expires=${res.expires_in}`
          document.cookie=`refresh_token=${res.refresh_token};`
          localStorage.setItem('token',res.access_token)
          localStorage.setItem('refresh_token',res.refresh_token)
          localStorage.setItem('expires_in',res.expires_in)
        },
        error:(err)=>{

        },
        complete:()=>{
          this.router.navigate([''])
        }
      })
    }
  }

  authLink=this._authUser.user_auth();

}
