import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { takeLast } from 'rxjs';
import { MusicApiService } from 'src/app/service/music-api.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlaylistModalComponent } from '../playlist-modal/playlist-modal.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss', '../artists/artists.component.scss']
})
export class TrackComponent implements OnInit {

  @ViewChild('scrollup') scrollup!: ElementRef

  displayedColumns: string[] = ['#', 'Track', 'Time'];
  id: any;
  data: any = {};
  artists_data: any[] = [];
  album_music = '';
  dataSource: any;
  curr_playing = '';
  play_button_show = true;
  resume_button=false
  album_data: any;
  toogle = true
  topTrack: any;
  isAlbum=''
  h = ''
  albumid = ''
  artists_albumData: any[] = [];
  artistID: any = []

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
  device_ID='';
  dialogRef:MatDialogRef<PlaylistModalComponent> | undefined
  rowClicked: any;
  constructor(private activaterouter: ActivatedRoute, private router: Router, public _musicService: MusicApiService,public _musicPlayer:MusicPlayerService,private dialogModel: MatDialog) {}

  ngOnInit(): void {
    
    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })

    this.activaterouter.params.subscribe((data: any) => {
      this.id = data.id
      this.artistID=[]
    })

    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{ this.curr_playing=res}})
    this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
    this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})

    this.onloadapi()
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

  onloadapi() {
    this._musicService.get_track_songs(this.id).subscribe({
      next: (res: any) => {
        this.dialogModel.open(PageLoaderComponent, {
          panelClass: 'my-loader-class'
        })
        this.data = res
        this.artists_data = res.artists
        this.album_music = res.album.id
      },
      error: (err) => { console.log(err) },
      complete: () => {
        this.artistID=[]
        this.artists_data.forEach((d: any) => {
          this.artistID.push(d.id)
        })
        this.artists_album(this.artistID)
      }
    })
  }

  show_album(id: string) {
    this.router.navigate(['/album', id])
  }

  show_artists(id: string) {
    this.router.navigate(['/artists', id])
  }

  other_artists(id: string) {
    this._musicService.get_serveal_artists(id).subscribe({
      next: (res: any) => {
        this.artists_data = res.artists
      },
      error: (err) => { console.log(err) },
      complete: () => {
        this.album_info()
      }

    })
  }

  more_album_songs() {
    this._musicService.get_album(this.album_music).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.tracks.items);
      },
      error: (err) => { console.log(err) },
      complete: () => {
        this.popular_tracks(this.artistID[0])
      }
    })
  }

  artist_comp(event: any, id: string) {
    event.stopPropagati
    this.router.navigate(['/artists', id])
  }

  album_info() {
    this._musicService.get_album(this.album_music).subscribe({
      next: (res: any) => {
        this.album_data = res
      },
      error: (err) => { console.log(err) },
      complete: () => {
        this.more_album_songs()
      }
    })
  }

  popular_tracks(id: string) {
    this._musicService.get_artists_top_track(id).subscribe({
      next: (res: any) => {
        this.topTrack = res.tracks
      },
      error: (err) => { console.log(err) },
      complete: () => {
        this.dialogModel.closeAll()
      }
    })

  }


  show_track(event: any, id: string) {
    event.stopPropagation()
    this.activaterouter.params.subscribe(routeParams => {
      this.id = id
    });
    this.router.navigate(['/track', id])
    this.activaterouter.params.pipe(takeLast(1)).subscribe((data: any) => {
      this.id = data.id
    });
    this.data = {}
    this.artists_data = []
    this.album_music = ''
    this.onloadapi()
    this.scrollup.nativeElement.scrollTo(0, 0);
  }

  artists_album(data: any) {
    data.forEach((id: any) => {
      this._musicService.get_artists_ablums(id, 'single,appears_on,album,compilation', 5).subscribe({
        next: (res: any) => {

          this.artists_albumData.push(res.items)
        },
        error: (err) => { console.log(err) },
        complete:()=>{
          this.other_artists(this.artistID.join(','))
        }
      })
    })

  }


  more_albums(id: string) {
    this.router.navigate([`/artists/${id}/discography`])
  }


  play_album(event:any,data:any){
    event.stopPropagation()
     this._musicPlayer.playmusic(data.uri,this._musicPlayer.DeviceID).subscribe({
          next:(res:any)=>{},
          complete:()=>{
            this._musicService.startInterval.next(true)
          }
        })
  }

  play_song(event:any,i:any){
    event.stopPropagation();
    this._musicPlayer.playtrack(i.uri,this._musicPlayer.DeviceID).subscribe({
      error:(err)=>{console.error('Play Music Error',err);},
      complete:()=>{
        this._musicService.startInterval.next(true)
      }
    })
  }

  menuOption(event:any){
    event.stopPropagation();
  }

  add_track_playlist(data:any){
    this.dialogRef=this.dialogModel.open(PlaylistModalComponent,{
      data:{
        id:data.uri
      }
    })
    this.rowClicked=100
  }

  add_track_queue(data:any){
    this._musicService.add_track_queue(data.uri).subscribe()
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


