import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { __values } from 'tslib';
import { PageLoaderComponent } from '../page-loader/page-loader.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-discography',
  templateUrl: './discography.component.html',
  styleUrls: ['./discography.component.scss']
})
export class DiscographyComponent implements OnInit  {

  
  album_collection: any[]=[];
  id='';
  album_type='album';
  resume_button=false;
  isAlbum=''
  constructor(private activeRoute: ActivatedRoute, private _homeService: HomeCallsService, private router: Router,private  _musicService:MusicApiService,private _musicPlayer:MusicPlayerService ,private dialogModel: MatDialog){ }

  ngOnInit(){

    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })

    this.activeRoute.params.subscribe((data:any) => {
      this.id=data.id
      });

      this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
      this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})

    this.artists_album()
  }

  artists_album(){
    this._musicService.get_artists_ablums(this.id,this.album_type,50).subscribe({
      next:(res:any)=>{
        this.album_collection=res.items
      },
      error:(err)=>{console.log(err)},
      complete:()=>{
        this.dialogModel.closeAll();
      }
    })
  }


  show_more_data(id:string){
    console.log(id);
    this.router.navigate(['/album',id])
  }

  ablum_change(value:any){
    this.album_type=value;
    this.artists_album()
  }

  play(event:any,data:any){
    event.stopPropagation()
    this._musicPlayer.playmusic(data.uri,this._musicPlayer.DeviceID).subscribe({
         next:(res:any)=>{},
         complete:()=>{
           this._musicService.startInterval.next(true)
         }
       })
  }

  pause(event:any){
    event.stopPropagation();
    this._musicPlayer.spotifyPlayer.pause().then(() => {
      this.resume_button=true
      this._musicPlayer.Button.next(false)
  });
  }

  resume(event:any){
    event.stopPropagation();
    this.resume_button=false
    this._musicPlayer.spotifyPlayer.togglePlay().then(() => {
    });
    this._musicPlayer.ResumeButton.next(true)
  }

}
