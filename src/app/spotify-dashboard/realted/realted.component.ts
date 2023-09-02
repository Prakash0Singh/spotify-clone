import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { PageLoaderComponent } from '../page-loader/page-loader.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-realted',
  templateUrl: './realted.component.html',
  styleUrls: ['./realted.component.scss']
})
export class RealtedComponent implements OnInit  {
  curr_playing='';
  recomm_artists: any[]=[];
  id='';

  constructor(private activeRoute: ActivatedRoute, private _homeService: HomeCallsService, private router: Router,private  _musicService:MusicApiService ,private dialogModel: MatDialog){ 
    console.log('Constructor Called ....');
    this._musicService.songid.subscribe((res:any)=>{
        this.curr_playing=res;
        console.log(res);
    })
  }

  ngOnInit(){
    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })
    this.activeRoute.params.subscribe((data:any) => {
      this.id=data.id
      });

    console.log(this.id);
    this.recommended()
  }

  recommended(){
    this._musicService.get_releated_artists(this.id).subscribe({
      next:(res:any)=>{
        console.log(res.artists);
        this.recomm_artists=res.artists
      },error:(err)=>{console.log(err)},
      complete:()=>{
        this.dialogModel.closeAll()
      }
    })
  }


  show_more_data(id:string){
    this.router.navigate(['/artists',id])
  }
}
