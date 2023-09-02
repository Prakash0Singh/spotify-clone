import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeCallsService {

  

  constructor(private http:HttpClient,private router:Router,private httpBackend: HttpBackend) {}
  base='https://api.spotify.com/v1/'
  
  new_releases(limit:number){
   return this.http.get(`${this.base}browse/new-releases?country=${'IN'}&limit=${limit}&offset=5`)
  }

  get_album(){
    return this.http.get(`${this.base}albums/4aawyAB9vmqN3uQ7FjRGTy?market=IN`)
  }

  user_saved_album(){
    return this.http.get(`${this.base}me/albums?limit=10&offset=5&market=IN`)
  }



  featured_playlist(limit:number){
    return this.http.get(`${this.base}browse/featured-playlists?limit=${limit}`)
  }

  user_profile(){
    return this.http.get(`${this.base}me`)
  }

  user_follow_artists(){
    return this.http.get(`${this.base}me/following?type=artist&limit=50`)
  }

  user_top_tracks(limit:number){
    return this.http.get(`${this.base}me/top/tracks?time_range=short_term&limit=${limit}`)
  }
  user_top_artists(limit:number){
    return this.http.get(`${this.base}me/top/artists?time_range=short_term&limit=${limit}`)
  }


  current_playing(){
    return this.http.get(`${this.base}me/player/currently-playing`)
  }

}
