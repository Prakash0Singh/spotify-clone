import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  id='';
  item_id=''
  token='';
  play_button_show=true
  albumid=''
  recomm_artists:any[]=[]
  collection:any[]=[]
  audio:any[]=[]
  exploretracks: any[]=[];
  resume_button=false;
  curr_playing='';
  isAlbum='';
  constructor( private activerouter:ActivatedRoute,private router:Router,private _homeService: HomeCallsService,private _musicService:MusicApiService,private _musicPlayer:MusicPlayerService ,private dialogModel: MatDialog){}

  ngOnInit(): void {

    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })

    this.token=localStorage.getItem('token')||'';
    
    this.activerouter.params.subscribe((data:any) => {
      this.id = data.id;
     });


     if (this.id=='newreleases') {
      this._homeService.new_releases(50).subscribe({
        next:(res:any)=>{
          this.collection=res.albums.items
        },
        error:(err)=>{

        },
        complete:()=>{
          this.dialogModel.closeAll()
        }
      })
     }

     else if(this.id=='editorpicks'){
 
        this._homeService.featured_playlist(50).subscribe({
          next:(res:any)=>{
            console.log(res.playlists?.items);
            this.collection=res.playlists?.items
          },
          error:(err)=>{
            console.error(err.error.error);
          },
          complete:()=>{this.dialogModel.closeAll()}
        })
     }
     else if(this.id=='exploremore'){
      this._musicService.get_tracks(50).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.exploretracks=res.tracks
        },
        error:(err)=>{console.log(err)},
        complete:()=>{this.dialogModel.closeAll()}
      })
     }
     else if(this.id=='recent_tracks'){
      this._homeService.user_top_tracks(50).subscribe({
        next:(res:any)=>{
          console.log('User TOp tracks',res);
          this.exploretracks=res.items
        },
        error:(err)=>{console.log(err)},
        complete:()=>{this.dialogModel.closeAll()}
      })
     }
     else if(this.id='top_artists'){
      this._homeService.user_top_artists(50).subscribe({
        next:(res:any)=>{
          this.recomm_artists=res.items
        },error:(err)=>{console.log(err)},
        complete:()=>{this.dialogModel.closeAll()}
      })
     }

     this.current_music();

  }

  
  current_music(){
    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{this.curr_playing=res}})
    this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})
    this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
  }
  
  play_album(event:any,data:any){
    let uri=data.uri
    event.stopPropagation();
    console.warn(data.id);

    console.log(this._musicPlayer.DeviceID);
    this._musicPlayer.playmusic(uri,this._musicPlayer.DeviceID).subscribe({
         next:(res:any)=>{
          this.play_button_show =false
          this._musicPlayer.Button.next(true)
         },
         error:(err)=>{
          this.play_button_show =true
         },
         complete:()=>{
          this._musicService.startInterval.next(true)
        }
    })


  }
  
  play_playlist(event:any,data:any){
    let uri=data.uri
    event.stopPropagation();
    console.warn(data.id);

    console.log(this._musicPlayer.DeviceID);
    this._musicPlayer.playmusic(uri,this._musicPlayer.DeviceID).subscribe({
         next:(res:any)=>{
          this.play_button_show =false
          this._musicPlayer.Button.next(true)
         },
         error:(err)=>{
          this.play_button_show =true
         },
         complete:()=>{
          this._musicService.startInterval.next(true)
        }
    })


  }

  pause_music(event:any){
    event.stopPropagation();
    this._musicPlayer.spotifyPlayer.pause().then(() => {
      this.resume_button=true
      this._musicPlayer.Button.next(false)
  });
  }

  show_more_data(event:any,id:string){
    event.stopPropagation();
    console.log(id);
    if (this.id=='newreleases') {
      this.router.navigate(['/album',id])
    } 
    else if(this.id=='editorpicks'){
  
      this.router.navigate(['/playlist',id])
    }
    else if (this.id=='top_artists') {
      this.router.navigate(['/artists',id])
    }
    else if(this.id=='recent_tracks'){
      this.router.navigate(['track',id])
    }
  }

  play_explore(event:any,i:any){
    event.stopPropagation();
    this._musicPlayer.playtrack(i.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{console.log(res)},
      error:(err)=>{console.error('Play Music Error',err);},
      complete:()=>{
        this._musicService.startInterval.next(true)
      }
    })
  }
  
  resume(event:any){
    event.stopPropagation();
    this.play_button_show=false;
    this.resume_button=false
    this._musicPlayer.spotifyPlayer.togglePlay().then(() => {
    });
    this._musicPlayer.ResumeButton.next(true)
  }
}
