import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject } from 'rxjs';
///  <reference types="../node_modules/@types/spotify-web-playback-sdk/index.d.ts"/>



@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  MUSIC_ALBUM_PLAYLIST=new BehaviorSubject<string>('')
  DeviceID='';
  isPlaying=new Subject<boolean>();
  isPlayingAlbum=new Subject<string>();
  spotifyPlayer!: Spotify.Player;
  spotifyToken=localStorage.getItem("token")

  CURRENT_ALBUM=new Subject<string>();
  ResumeButton=new BehaviorSubject<boolean>(false)
  Button=new BehaviorSubject<boolean>(false);
  PlayingMusicID=new BehaviorSubject<string>('');
 
  deviceID='';
  Music_postition: number=0;
  constructor(private http:HttpClient,private router:Router,private httpBackend: HttpBackend) { }
  newHttpClient = new HttpClient(this.httpBackend);
  player:any;
  base='https://api.spotify.com/v1/'
  arr:any[]=[]

  spotify_player(){
    (<any>window).onSpotifyWebPlaybackSDKReady = this.connectPlayer.bind(this);
  }

  connectPlayer(){
    this.spotifyPlayer = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb) => {
          cb(localStorage.getItem("token")||'');
        },
        volume: 0.5,
      });

      this.spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
       this.deviceID=device_id
       this.DeviceID=device_id
      });

      this.spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });

      this.spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });

      this.spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error(message);
      });
      this.spotifyPlayer.connect();

      this.spotifyPlayer.getVolume().then(volume => {
        
      });

 


    
  }


 
  
  get_playbackState(){
    return this.http.get(`${this.base}player`)
  }

  deviceinfo(){
    return this.http.get(`${this.base}me/player/devices`)
  }

  playmusic(uri:string ,id:string){
    this.Button.next(true)    
    return this.newHttpClient.put(`${this.base}me/player/play?device_id=${id}`,{
      "context_uri":uri,
      "offset": {
          "position": 0
      },
      "position_ms": 0
  },
  {
  headers: {
          Accept: 'application/json',
          Authorization: `Bearer  ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
      }
  })
  }
  
  playtrack(uri:string,id:string){
    this.Button.next(true)
    return this.newHttpClient.put(`${this.base}me/player/play?device_id=${id}`,{
      "uris":[uri],
      "offset": {
          "position": 0
      },
      "position_ms": 0
  },
  {
  headers: {
          Accept: 'application/json',
          Authorization: `Bearer  ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
      }
  })
  }

  current_playingtrack(){
    return this.http.get(`${this.base}me/player/currently-playing`)
  }

  shuffle_music(data:string){
    return this.http.put(`${this.base}me/player/shuffle?state=${true}`,data)
  }


  pause_playback(data:string){
    return this.http.put(`${this.base}me/player/pause`,data)
  }

  recent_played_track(){
    return this.http.get(`${this.base}me/player/recently-played`)
  }

 

  add_queue(uri:string){
    return this.http.get(`${this.base}me/player/queue?uri=${uri}`)
  }

 


}
