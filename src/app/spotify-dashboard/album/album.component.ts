import { Component,ElementRef,OnChanges,OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, ResolveEnd, Router, RouterEvent } from '@angular/router';
import { filter, take } from 'rxjs';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { PlaylistModalComponent } from '../playlist-modal/playlist-modal.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss','../home/home.component.scss']
})
export class AlbumComponent implements OnInit {
  displayedColumns: string[] = ['#', 'Track', 'Time'];
  token='';
  id: any;
  data:any={};
  tracks: any[]=[];
  play_button_show=true;
  resume_button=false
  dataSource: any;
  curr_playing: any;
  albumID=''
  check_functionality: any[]=[];
  isAlbum=''

  dialogRef:MatDialogRef<PlaylistModalComponent> | undefined
  
  @ViewChild('scrollup') scrollup!:ElementRef
  device_ID: string='';
  follow=false
  containerStyle={
    'background-image':`linear-gradient(#958f8f, #242424)`
  }
  rowClicked:any
  constructor(private activaterouter: ActivatedRoute, private router: Router,private _musicService:MusicApiService,private _musicPlayer:MusicPlayerService,private dialogModel: MatDialog) 
  {}



  ngOnInit(): void {
    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })
    this.subject_routing()
  this.album_data()
  // this.currentplaying()
  }

  subject_routing(){
    this.activaterouter.params.subscribe((data:any) => {
      this.id=data.id

      this.router.events.pipe(
        filter((e: any): e is RouterEvent => e instanceof NavigationEnd),take(1)
     ).subscribe((event:any) => {
      let url=event.url
      console.log(url.split('/')[2]);
         this.id=url.split('/')[2];

      if (this.id!=undefined) {
      this._musicPlayer.MUSIC_ALBUM_PLAYLIST.subscribe({
        next:(res)=>{
          this.dialogModel.open(PageLoaderComponent, {
            panelClass: 'my-loader-class'
          })
          if (res==this.id) {
            this.play_button_show=false;
          }
        }
      })
      this.play_button_show=true;
          this.data={}
          this.album_data();
          this.scrollup?.nativeElement.scrollTo( 0, 0 );
        }   
      });

    });

    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{
      this.curr_playing=res
    }})

    this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})
    this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
  }

  album_data(){
    this.check_album();
    
    this._musicService.get_album(this.id).subscribe({
      next:(res:any)=>{
        this.data=res
      },
      error:(err)=>{console.log(err)},
      complete:()=>{
        this.dataSource = new MatTableDataSource(this.data.tracks.items); 
        this.dialogModel.closeAll();
      }
    })
  }

  play_song(i:any){
    this._musicPlayer.playtrack(i.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{},
      error:(err)=>{console.error('Play Music Error',err);},
      complete:()=>{
        this.play_button_show=false
        this._musicService.startInterval.next(true)
      }
    })
  }

  artist_comp(event:any,data:any){
    event.stopPropagation();
    this.router.navigate(['/artists',data.id])
  }
  

  
  show_track(event: any,data: any) {
    event.stopPropagation()
    this.router.navigate(['track',data.id])
  }

  play(event:any,data:any){
    
    let uri=data.uri
    event.stopPropagation();

    this._musicPlayer.playmusic(uri,this._musicPlayer.DeviceID).subscribe({
         next:(res:any)=>{
          this.play_button_show =false
          this._musicPlayer.Button.next(true)
         },
         error:(err)=>{
          this.play_button_show =true
         },
         complete:()=>{

          this._musicPlayer.MUSIC_ALBUM_PLAYLIST.next(this.id)
          this._musicService.startInterval.next(true)

        }
    })



  }

  pause(event:any){
    event.stopPropagation();
    this._musicPlayer.spotifyPlayer.pause().then(() => {
      this.play_button_show=true;
      this.resume_button=true
      this._musicPlayer.Button.next(false)
  });
  }

  resume(event:any){
    event.stopPropagation();
    this.play_button_show=false;
    this.resume_button=false
    this._musicPlayer.spotifyPlayer.togglePlay().then(() => {
    });
    this._musicPlayer.ResumeButton.next(true)
  }

  currentplaying(){
    this._musicPlayer.spotifyPlayer.addListener('player_state_changed', ({
      position,
      duration,
      track_window: { current_track }}) => {
    });
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

  check_album(){
    this._musicService.check_album_followed(this.id).subscribe({
      next:(res:any)=>{
        this.follow=res[0]
      }
    })
  }

  unfollow_album(data:any){

    console.log(data.id);
    this._musicService.remove_album(data.id).subscribe({
      complete:()=>{
        this.follow=false
        this._musicService.updateList.next(true)
      }
    })
  }
  
  
  follow_album(data:any){
    console.log(data.id);
    this._musicService.save_album(data.id).subscribe({
      complete:()=>{
        this.follow=true
        this._musicService.updateList.next(true)
      }
    })
    
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
