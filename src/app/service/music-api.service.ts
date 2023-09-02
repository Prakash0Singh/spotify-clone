import { HttpClient, HttpBackend, HttpHeaders, HttpParams } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicApiService {

  defaultProfile = '../../assets/user.png';
  userImage = '../../assets/profile.png'
  defaultImage = '../../assets/default_img.jpg'
  defaultPlaylist = '../../assets/defalut_playlist.jpg'
  currentSong = new Subject<any>();
  songid = new Subject<string>();
  mainPause = new Subject<any>();
  pauseButton = new Subject<any>();
  resumeButton = new Subject<boolean>();
  updateList= new BehaviorSubject<boolean>(false);
  startInterval=new BehaviorSubject<boolean>(false);

  musicplayerpause = new Subject<any>();

  currentPlayingInfo = new BehaviorSubject<any>('Default Value');

  constructor(private http: HttpClient, private router: Router, private httpBackend: HttpBackend,private dialogModel: MatDialog) { }
  newHttpClient = new HttpClient(this.httpBackend);
  base = 'https://api.spotify.com/v1/'

  create_playlist(userid: string, data: any) {
    return this.http.post(`${this.base}users/${userid}/playlists`, data)
  }

  update_playlist_image(img: string, id: string) {
    return this.newHttpClient.put(`${this.base}playlists/${id}/images`, img, {
      headers: {
        Accept: 'image/jpeg',
        'Authorization': `Bearer  ${localStorage.getItem("token")}`,
        "Content-Type": "image/jpeg",
      }
    },
    )
  }

  add_track_playlist(id: string, trackid: string) {
    return this.newHttpClient.post(`${this.base}playlists/${id}/tracks`, {
      "uris": [trackid],
      "position": 0
    },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer  ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      })
  }

  remove_track_playlist(id: string, trackid: string,index:number) {
   
    let data: any = {
      "tracks": [{"uri": trackid, "positions": [index]}]
    }
    let header = new HttpHeaders({
      'Authorization': `Bearer  ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json'
    })

    const options={
      headers:header,
      body:data
    }

    return this.newHttpClient.delete(`${this.base}playlists/${id}/tracks`,options)
  }

  current_playing() {
    return this.http.get(`${this.base}me/player/currently-playing `)
  }

  user_made_playlist(username: string) {
    return this.http.get(`${this.base}users/${username}/playlists`)
  }

  user_profile() {
    return this.http.get(`${this.base}me`)
  }


  user_saved_playlist() {
    return this.http.get(`${this.base}me/playlists`)
  }
  user_saved_album() {
    return this.http.get(`${this.base}me/albums`)
  }

  play_this_song(songurl: any) {
    this.currentSong.next(songurl)
  }

  pause_button(id: string) {
    return this.pauseButton.next(id)
  }

  playing_music_id(id: string) {
    this.songid.next(id)
  }

  get_album(id: string) {
    return this.http.get(`${this.base}albums/${id}`)
  }

  get_album_tracks(id: string) {
    return this.http.get(`${this.base}albums/${id}/tracks`)
  }

  get_playlist(id: string) {
    return this.http.get(`${this.base}playlists/${id}`)
  }

  get_tracks(limit: number) {
    return this.http.get(`${this.base}recommendations?limit=${limit}&market=IN&seed_genres=indian`)
  }

  get_track_songs(id: string) {
    return this.http.get(`${this.base}tracks/${id}`)
  }

  get_artists(id: string) {
    return this.http.get(`${this.base}artists/${id}`)
  }
  get_serveal_artists(id: string) {
    return this.http.get(`${this.base}artists?ids=${id}`)
  }
  get_artists_top_track(id: string) {
    return this.http.get(`${this.base}artists/${id}/top-tracks?market=IN`)
  }
  get_releated_artists(id: string) {
    return this.http.get(`${this.base}artists/${id}/related-artists`)
  }

  get_artists_ablums(id: string, group: string, limit: number) {
    return this.http.get(`${this.base}artists/${id}/albums?include_groups=${group}&limit=${limit}`)
  }

  search_api(q: string,limit:number) {
    return this.http.get(`${this.base}search?q=${q}&type=album%2Cplaylist%2Ctrack%2Cartist&include_external=audio&limit=${limit}`)
  }

  follow_artists(id: string) {
    return this.http.put(`${this.base}me/following?type=artist&ids=${id}`, {
      "ids": [id]
    })
  }
  unfollow_artists(id: string) {
    console.log("Follow Artists", id);
    return this.http.delete(`${this.base}me/following?type=artist&ids=${id}`)
  }

  check_artists_followed(id: string) {
    return this.http.get(`${this.base}me/following/contains?type=artist&ids=${id}`)
  }
  check_playlist_followed(id:string,userid:string){
    return this.http.get(`${this.base}playlists/${id}/followers/contains?ids=${userid} `)
  }

  check_album_followed(id:string){
    return this.http.get(`${this.base}me/albums/contains?ids=${id}`)
  }

  unfollow_playlist(id:string){
    return this.http.delete(`${this.base}playlists/${id}/followers`)
  }

  follow_playlist(id:string){
    return this.http.put(`${this.base}playlists/${id}/followers`,{public:true})
  }

  save_album(id:string){
    return this.http.put(`${this.base}me/albums?ids=${id}`,{"ids": [id]})
  }

  remove_album(id:string){
    return this.http.delete(`${this.base}me/albums?ids=${id}`)
  }

  add_track_queue(track_id:string){
    let data= new HttpParams().set('uri',track_id)
    return this.http.post(`${this.base}me/player/queue?uri=${track_id}`,data)
  }

  get_queue(){
    return this.http.get(`${this.base}me/player/queue`)
  }

  recent_music(){
    let date=new Date().getTime()
   return this.http.get(`${this.base}me/player/recently-played?limit=10&before=${date}`)
  }

  logout(){
    localStorage.clear();
    this.dialogModel.closeAll();
    
  }



}

