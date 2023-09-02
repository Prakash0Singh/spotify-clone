import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss','../artists/artists.component.scss']
})
export class UserProfileComponent implements OnInit {
  recomm_artists: any[]=[];
  data: any={}

  constructor(private activeRoute: ActivatedRoute, private _userService: HomeCallsService, private router: Router,public  _musicService:MusicApiService){}
   ngOnInit(){
    this.userData()
  }
  
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 0,
    navText: ['', ''],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      640: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      }
    },
    nav: false
  }
  
  userData(){
  this._userService.user_profile().subscribe({
    next:(res:any)=>{
      this.data=res
    },
    error:(err)=>{console.log(err)}
  })
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/log-user'])
  }


}
