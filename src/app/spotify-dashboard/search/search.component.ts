import { Component,OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { PlaylistModalComponent } from '../playlist-modal/playlist-modal.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss','../artists/artists.component.scss']
})
export class SearchComponent implements OnInit {

  artists: any=[]
  albums:any[]=[]
  playlists:any[]=[]
  tracks:any[]=[]
  search_data=false;
  play_button_show=true
  playlist_button=true
  albumid=''
  playlistid=''
  dataSource:any
  toogle=true
  trackSource:any
  dialogRef:MatDialogRef<PlaylistModalComponent> | undefined

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
  radio_value='search_all';
  curr_playing: any;
  check_functionality: any;
  testing=true;
  resume_button=false;
  displayedColumns: string[] = ['Track', 'Time'];
  isAlbum='';
  rowClicked: any;

  constructor( public router: Router,public  _musicService:MusicApiService,private _musicPlayer: MusicPlayerService,private dialogModel: MatDialog){}

  ngOnInit(){
    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{ this.curr_playing=res}})
    this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
    this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})
    
    let data={
      'album':'sample',
      'artists':'sample',
      'id':'sample',
      'name':'sample',
      'preview_url':'sample',
    }
    
    this.tracks=[data]
    // this.trackSource = new MatTableDataSource(this.tracks);
  }

  search(value:string){
    if (value.length>=4) {

      this.dialogModel.open(PageLoaderComponent, {
        panelClass: 'my-loader-class'
      })

      this._musicService.search_api(value,20).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.albums=res.albums.items
          this.artists=res.artists.items
          this.playlists=res.playlists.items
          this.tracks=res.tracks.items
          this.trackSource = new MatTableDataSource(this.tracks);
        },error:(err)=>{console.log(err)},
        complete:()=>{
          this.search_data=true
          this.dialogModel.closeAll()
        }
      })
    }
    else{alert('Minimum 4 Letters are Required')}
  }

  show_album(id:string){
    console.log(id);
    this.router.navigate(['/album',id])
  }
  
  show_playlist(id:any){
    this.router.navigate(['/playlist',id])
  }

  play_playlist(event:any ,data:any){
    event.stopPropagation();
    this._musicPlayer.playmusic(data.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{console.log(res)},
      error:(err)=>{console.error('Play Music Error',err);},
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
  
  play_song(i:any){
    console.warn(i);
    console.log(this._musicPlayer.DeviceID);
    this._musicPlayer.playtrack(i.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{console.log(res)},
      error:(err)=>{console.error('Play Music Error',err);},
      complete:()=>{
        this.play_button_show=false
        this._musicService.startInterval.next(true)
      }
    })
  }

  
  show_track(event: any,data: any) {
    event.stopPropagation()
    console.log(data.id);
    this.router.navigate(['track',data.id])
  }

  show_artists(event:any,i:any){
    event.stopPropagation();
    console.log(i);
    this.router.navigate(['/artists',i.id])
   
  }
 

  showdata(target:any){
  console.log(target.value);
  this.radio_value=target.value
  }

  artist_comp(event: any, id: string) {
    event.stopPropagation();
    console.log(id);
    this.router.navigate(['/artists', id])
  }

  follow_artists(event:any,data:any){
    event.stopPropagation();
    console.log('Artist-data',data);
    this._musicService.follow_artists(data).subscribe();
  }

  menuOption(event:any){
    event.stopPropagation();
  }

  add_track_playlist(data:any){

    console.log(data);
    this.dialogRef=this.dialogModel.open(PlaylistModalComponent,{
      data:{
        id:data.uri
      }
    })
    this.rowClicked=100
  }

  add_track_queue(data:any){
 
    console.log(data.uri);
    this._musicService.add_track_queue(data.uri).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
    this.rowClicked=100
  }

  changeTableRowColor(index:any){
    // event.stopPropagation();
    if(this.rowClicked === index) this.rowClicked = -1;
    else this.rowClicked = index;
  }

  menuClosed() {
    this.rowClicked=100
  }
  
}
