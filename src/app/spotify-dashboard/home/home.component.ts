import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { MatDialog } from '@angular/material/dialog';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss','../artists/artists.component.scss']
})
export class HomeComponent implements OnInit {
  featured_list: any = [];
  newRelease: any = [];

  code: string = '';
  login: boolean=false;
  // audio='https://p.scdn.co/mp3-preview/6dfb1f245f9e9791124c922eeeb42be91645b343?cid=00ba17a75b5641aaba00ef7b581e7a0a';
  audio:any[]=[]
  userPlayed: any[]=[];
  play_button_show=true
  playlist_button=true
  explore_button=true
  exploreid=''
  albumid=''
  party_tracks: any[]=[]
  check_functionality: any[]=[];
  recomm_artists:any[]=[];
  currentplayingID='';
  device_ID=''

  resume_button=false;
  isAlbum='';
  curr_playing='';

  constructor(private _homeService: HomeCallsService, public router: Router,public _musicService:MusicApiService,private _musicPlayer:MusicPlayerService,private dialogModel: MatDialog)
   { }
  
  CLIENT_ID = '00ba17a75b5641aaba00ef7b581e7a0a';
  REDIRECT_URI = 'http://localhost:4200';
  token = ''
  user_profile=''
  playlistid=''
  recent_played:any=[]
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

  ngOnInit() {
    this.token=localStorage.getItem('token')||'';
    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })
    this.current_music()
    this.user_tracks();
  }

  current_music(){
    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{this.curr_playing=res}})
    this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})
    this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
  }

  profile(){
  return this._homeService.user_profile().subscribe({
    next:(res:any)=>{localStorage.setItem('userid',res.id)},
    error:(err)=>{console.log(err)},
    complete:()=>{
      this.dialogModel.closeAll();
    }
  })
  }

  new_album() {
    this._homeService.new_releases(5).subscribe({
      next: (res: any) => {
    
        this.newRelease = res.albums.items
      },
      error: (err) => {
        console.log(err.error?.error?.message);
      },
      complete: () => {
        this.user_tracks_recomm()
       }
    })
  }

  playlist(){
    this._homeService.featured_playlist(5).subscribe({
      next:(res:any)=>{
  
        this.featured_list=res.playlists?.items
        // console.log(res.playlists?.items);
      },
      error:(err)=>{
        console.error(err.error.error);
      },
      complete:()=>{
        this.profile()
      }
    })
  }

  showlist(d:string){
    this.router.navigate(['/section',d])
  }

  show_album(id:string){
    this.router.navigate(['/album',id])
  }

  user_tracks(){
    this._homeService.user_top_tracks(5).subscribe({
      next:(res:any)=>{
        this.recent_played=res.items
      },
      error:(err)=>{console.error(err)},
      complete:()=>{
       this.user_artists()
      }
    })
  }

  user_artists(){
    this._homeService.user_top_artists(5).subscribe({
      next:(res:any)=>{
        this.recomm_artists=res.items
      },
      error:(err)=>{console.log(err);},
      complete:()=>{
        this.new_album()
      }
    })
  }


  user_tracks_recomm(){
    this._musicService.get_tracks(5).subscribe({
      next:(res:any)=>{

        this.party_tracks=res.tracks

      },
      error:(err)=>{
        console.log(err);
      },
      complete:()=>{
        this.playlist()
      }
    })
  }

  show_playlist(id:any){
    this.router.navigate(['/playlist',id])
  }

  show_explore(id:string){
    this.router.navigate(['track',id])
  }

  play_album(event:any,data:any){
    event.stopPropagation()
    console.log(data.uri);
    console.log(this._musicPlayer.DeviceID);
     this._musicPlayer.playmusic(data.uri,this._musicPlayer.DeviceID).subscribe({
          complete:()=>{
            this._musicService.startInterval.next(true)
          }
        })

  }


  play_playlist(event:any,data:any){
    event.stopPropagation();
    this._musicPlayer.playtrack(data.uri,this._musicPlayer.DeviceID).subscribe({
      complete:()=>{
        this._musicService.startInterval.next(true)
      }
    })
  }

  pause(event:any){
    event.stopPropagation();
    this._musicPlayer.spotifyPlayer.pause().then(() => {
      this.resume_button=true
    });
  }

  resume(event:any){
    event.stopPropagation();
    this.resume_button=false
    this._musicPlayer.spotifyPlayer.togglePlay().then(() => {});
    this._musicPlayer.ResumeButton.next(true)
  }


  show_artists(i:any){
    this.router.navigate(['/artists',i.id])
  }

  play_track(event:any,data:any){
    
    event.stopPropagation()
    console.log(data.uri);
     this._musicPlayer.playtrack(data.uri,this._musicPlayer.DeviceID).subscribe({
          complete:()=>{
            this._musicService.startInterval.next(true)
          }
        })
      

  }
}

