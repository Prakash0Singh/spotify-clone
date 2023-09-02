import { Component, ElementRef, OnInit ,ViewChild,OnDestroy,DoCheck, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { HomeCallsService } from '../service/home-calls.service';
import { MusicApiService } from '../service/music-api.service';
import { MusicPlayerService } from '../service/music-player.service';
import { Subject} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MusicQueueComponent } from './music-queue/music-queue.component';
declare global {
  interface window {
    onSpotifyWebPlaybackSDKReady: () => void;
    spotifyReady: Promise<void>;
  }
}

/// <reference path="../node_modules/@types/spotify-web-playback-sdk/index.d.ts"/>
@Component({
  selector: 'app-spotify-dashboard',
  templateUrl: './spotify-dashboard.component.html',
  styleUrls: ['./spotify-dashboard.component.scss']
})
export class SpotifyDashboardComponent implements OnInit,OnDestroy{

  @ViewChild('music_player')music_player!:ElementRef

  //--------------
  DeviceID=new Subject <string>();


  spotifyToken=localStorage.getItem("token")
  deviceID='';
  //--------------
  token='';
  user_profile='';
  followed_artist:any[]=[]
  count=0
  current_music:any[]=[]
  music=new Audio()
  music_progress=0
  play_button_show: boolean=true;
  checking:any
  show=false
  device_id=''
  userSavedPlaylist:any[]=[]
  userSavedAlbum:any[]=[]
  playlist_boolean=true;
  artist_boolean=true;
  albums_boolean=true;
  player: any;
  current_track_info: any;
  playback:any;
  duration: number=0;
  volume=0;
  player_state_interval: any;
  p:number=0;


  @ViewChild('myCityDialog') cityDialog = {} as TemplateRef<any>; 
  
  constructor(private _homeService: HomeCallsService, public router: Router,public  _musicService:MusicApiService,public _musicPlayer:MusicPlayerService ,private matdialog:MatDialog,
    private _bottomSheet: MatBottomSheet)
   {       

    this._musicPlayer.Button.subscribe({
      next:(res:boolean)=>{

        if (res==true) {
          this.play_music()
          this._musicPlayer.spotifyPlayer.getVolume().then(volume => {
            let volume_percentage = volume * 100;
            this.volume=volume_percentage
          });
          // this.current_playing()
        }
        else{
          this.play_button_show=true
        }
      },
    })

    this._musicPlayer.ResumeButton.subscribe({
      next:(res:boolean)=>{
        if (res==true) {
          this.play_button_show=false
        }
      },
    })

    this.token=localStorage.getItem('token')||'';
    this.createWebPlayer()

  
  }
 

  ngOnInit(){

    this._musicService.updateList.subscribe({
      next:(res:any)=>{this.followedArtists()}
    })

    this._musicService.recent_music().subscribe({
      next:(res)=>{}
    })
    // this.create_device()
   
    this.user_profile=localStorage.getItem('refresh_token')||''
    this.followedArtists();
    this._musicPlayer.spotify_player();

this._musicService.startInterval.subscribe({
  next:(res)=>{
    if (res) {
    clearInterval(this.player_state_interval)
      this.player_state_interval=setInterval(() => {
        this.loadPlayerState()
      },3000);
      
    }
  }
})
  }

  loadPlayerState(){
    this._musicPlayer.current_playingtrack().subscribe({
      next:(res:any)=>{
        this.current_track_info=res?.item
        this._musicPlayer.isPlayingAlbum.next(res?.item?.album?.id)
        this._musicPlayer.isPlaying.next(res?.is_playing)
        this._musicPlayer.PlayingMusicID.next(this.current_track_info?.id)
        this.playback=res
        if (res?.is_playing) {
          this.play_button_show=false
        }
        else{
          this.play_button_show=true
        }
      },
      complete:()=> {
       this.p= this.getSongProgress()
      },
    })
      
  }

  getSongProgress(){
    if (!this.playback) {
     return 0 
    }
    else{
      let percent=Math.trunc((this.playback?.progress_ms/this.playback?.item?.duration_ms)*100)
      if (!Number.isNaN(percent)) {
        return this.playback?.progress_ms
      }
      else{
        return 0
      }
    }
  }


  createWebPlayer(){
    const script= document.createElement('script')
    script.src='https://sdk.scdn.co/spotify-player.js'
    script.type = 'text/javascript';
     script.addEventListener('load', (e) => {
     })
     document.head.appendChild(script); 
   }

  devicInfo(){
    this.device_id= this._musicPlayer.DeviceID
  }

  suffle(){
    this._musicPlayer.shuffle_music(this.deviceID).subscribe()
  }


  followedArtists(){
    this._homeService.user_follow_artists().subscribe({
      next:(res:any)=>{
        //console.log(res);
        this.followed_artist=res.artists.items
      },
      error:(err)=>{
        //console.log(err)
      },
      complete:()=>{
        this._musicService.user_saved_playlist().subscribe((res:any)=>{this.userSavedPlaylist=res.items})
        this._musicService.user_saved_album().subscribe((res:any)=>{this.userSavedAlbum=res.items})
      }

    })
  }

  music_queue(){
   

    this._musicService.user_saved_playlist().subscribe({
      next:(res:any)=>{
   
        this.userSavedPlaylist=res.items
      }
    })
    this._musicService.user_saved_album().subscribe({
      next:(res:any)=>{
     
        this.userSavedAlbum=res.items
      }
    })
  }

  play_music(){
    // this._musicPlayer.playtrack('ll',this.device_id).subscribe((res:any)=>{console.log('Pause Button Clicked',res)})
    
    this._musicPlayer.spotifyPlayer.resume().then(() => {});
      // this.current_playing()   
      // this.spotifyPlayer.resume().then(() => {
    //   console.log('Resumed!');
    // });

    //console.log('Play music Function Call');
    // this.music_player.nativeElement.play()
    // //console.log(this.music_player.play());
    // this.music.play()
    // this.music_progress=Math.round(this.music.currentTime)

    //console.log(Math.round(this.music.currentTime));
    this.play_button_show=false
    // this._musicPlayer.spotifyPlayer.on('player_state_changed', state => {
    //   this.playback=state.position
    // });

  }
  
  pauser_music(){
    this._musicPlayer.spotifyPlayer.pause().then(() => {});   
    // this.current_playing()   
    //console.log('Pause Music ');
    // this.music.pause();
    this.play_button_show=true
    this._musicPlayer.spotifyPlayer.getVolume().then(volume => {
      let volume_percentage = volume * 100;
      this.volume=volume_percentage
    });
    // this._musicService.mainPause.next(true)
   
  }

  music_progress_bar(event:any){
    console.log(event.target.value);
    this._musicPlayer.spotifyPlayer.seek(Number(event.target.value)).then(() => {});
  }

  next_music(){
    this._musicPlayer.spotifyPlayer.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }
    
      var current_track = state.track_window.current_track;
      var next_track = state.track_window.next_tracks[0];
    

      if (next_track==undefined) {
        alert('No Song on Queue')
      }
      else{
        this._musicPlayer.spotifyPlayer.nextTrack().then(() => {});
      }
    });

    // this.count++;
    // if(this.count<this.current_music.length) { 
    //   if (this.current_music[this.count].preview_url==null) {
    //     //console.log("Song is Empty");
    //     this.next_music()
    //   }
    //   this.music.src=this.current_music[this.count].preview_url
    //   this.music.play()
    //   this.play_button_show=false
    //   this._musicService.playing_music_id(this.current_music[this.count].id)
    // }
    // else{
    //   this.count=this.current_music.length-1
    // }
  }

  previous_music(){
    this._musicPlayer.spotifyPlayer.previousTrack().then(() => {});
    this.current_music_info()

  }

  change_volume(event:any){
    this._musicPlayer.spotifyPlayer.setVolume(Number(event.target.value)/100).then(() => {})
  }

  artists_info(data:any){
    let id=data.uri.replace('spotify:artist:','');
    this.router.navigate(['/artists',id])
  }

  track_info(id:string)
  {
    //console.log(id);
    this.router.navigate(['/track',id])
  }

  radio_Value(event:any){
    this.show=true
  this.playlist_boolean=false;
  this.artist_boolean=false;
  this.albums_boolean=false;
    if ("playlist"==event.target.id) {
      this.playlist_boolean=true
    }
    else if ("artists"==event.target.id) {
      this.artist_boolean=true
    }
    else if ("albums"==event.target.id) {
      this.albums_boolean=true
    }
  }

  clearoption(event:any){
    // console.log('Clear Radio Value');
    this.show=false
    // console.log(event.target.id);
    this.playlist_boolean=true;
  this.artist_boolean=true;
  this.albums_boolean=true;
  }

  current_playing(){
    this._musicPlayer.spotifyPlayer.addListener('player_state_changed', ({
      position,
      duration,
      track_window: { current_track }}) => {
        this.current_track_info=current_track
      this.duration=duration
    });
  
    this._musicPlayer.PlayingMusicID.next(this.current_track_info?.id)

    this._musicPlayer.spotifyPlayer.getVolume().then(volume => {
      let volume_percentage = volume * 100;
      this.volume=volume_percentage
    });

  }

  current_music_info(){
    setTimeout(() => {
      this._musicPlayer.current_playingtrack().subscribe({
        next:(res:any)=>{
          console.log(res);
          this._musicPlayer.CURRENT_ALBUM.next(res.item?.album.id)
          this._musicPlayer.PlayingMusicID.next(res.item?.id)
        }
      })
    }, 5000);
  }

  createPlaylist(){
    this.matdialog.open(this.cityDialog)
  }

  onSubmit(form:any){
    console.log(form.value);
    let id=''
    let userid=''
    this._musicService.user_profile().subscribe({
        next:(res:any)=>{
          console.log(res.id);
          userid=res.id
        },
        complete:()=>{
          this._musicService.create_playlist(userid,form.value).subscribe({
            next:(res:any)=>{id=res.id},
            complete:()=>{
              this.matdialog.closeAll()
              this.router.navigate(['/playlist',id])
            }
          })
        }
      })
  }

  track_queue(){
    this._bottomSheet.open(MusicQueueComponent)
  }

  ngOnDestroy(){
    this._musicPlayer.spotifyPlayer.disconnect()
    console.log('SDK REMOVED');

    clearInterval(this.player_state_interval)
  }
}