import { Component ,ElementRef,OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationEnd, ResolveEnd, Router, RouterEvent } from '@angular/router';
import { HomeCallsService } from 'src/app/service/home-calls.service';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filter, last, take, takeLast } from 'rxjs';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PlaylistModalComponent } from '../playlist-modal/playlist-modal.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  displayedColumns: string[] = ['#', 'Track', 'Album','Popularity', 'Time'];
  dataSource:any
  play_button_show=true
  follow_button_show=false;
  curr_playing='';
  isAlbum=''
  id: any;
  data: any={};
  tracks: any[]=[]
  recomm_artists:any[]=[]
  album_type='album'
  defaut_img='../../../assets/default_img.jpg'
  artists_albumData:any[]=[]
  containerStyle={
    'background-image':`linear-gradient(#958f8f, #242424)`
  }
  resume_button=false

  @ViewChild('scrollup') scrollup!:ElementRef

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
  albumid: any;
  dialogRef:MatDialogRef<PlaylistModalComponent> | undefined
  rowClicked:any;
  constructor(private activeRoute: ActivatedRoute, private _musicPlayer: MusicPlayerService, private router: Router,public  _musicService:MusicApiService,private dialogModel: MatDialog){ 
  }

  ngOnInit(): void {
    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })
    this.route_share();
    
    this.artists_data();
  }

  route_share(){
    this.activeRoute.params.subscribe((data:any) => {
      this.id=data.id
      
      this.router.events.pipe(
        filter((e: any): e is RouterEvent => e instanceof NavigationEnd),take(1)
     ).subscribe((event:any) => {
       let url=event.url
          this.id=url.split('/')[2];

      if (this.id!=undefined) {
          this.data={}
          this.artists_data();
          this.scrollup?.nativeElement.scrollTo( 0, 0 );
        }
      });
      this.dialogModel.open(PageLoaderComponent, {
        panelClass: 'my-loader-class'
      })
      });
  
    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{
        this.curr_playing=res
      }}
    )

    this._musicPlayer.isPlaying.subscribe({next:(res)=>{this.resume_button=!res}})
    this._musicPlayer.isPlayingAlbum.subscribe({next:(res)=>{this.isAlbum=res}})
  }

  artists_data() {
    this._musicService.get_artists(this.id).subscribe({
      next: (res: any) => {
        this.data = res;
      },
      error: (err) => { console.log(err); },
      complete: () => {
        this._musicService.check_artists_followed(this.data.id).subscribe((res:any)=>{this.follow_button_show= res[0]})
        this.top_track();
        
 
      }
    });
  }

  top_track(){
    this._musicService.get_artists_top_track(this.id).subscribe({
      next:(res:any)=>{
        this.tracks=res.tracks
        // console.log(this.tracks);
      },
      error:(err)=>{console.log(err)},
      complete:()=>{
        this.dataSource = new MatTableDataSource(this.tracks);  
        this.recommended();
      }
    })
  }

  recommended(){
    this._musicService.get_releated_artists(this.id).subscribe({
      next:(res:any)=>{
        // console.log(res.artists);
        this.recomm_artists=res.artists
      },error:(err)=>{console.log(err)},
      complete:()=>{
        this.artists_album();
      }
    })
  }



  play_song(i:any){
    console.log(i.uri);
    console.log(this._musicPlayer.DeviceID);
    this._musicPlayer.playtrack(i.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{console.log(res)},
      error:(err)=>{console.error('Play Music Error',err);},
      complete:()=>{
        this._musicService.startInterval.next(true)
      }
    })
  }

  artists_album(){
    this._musicService.get_artists_ablums(this.id,this.album_type,5).subscribe({
      next:(res:any)=>{
        this.artists_albumData=res.items
      },
      error:(err)=>{console.log(err)},
      complete:()=>{
        this.dialogModel.closeAll()
      }
    })
  }

  play_album(event:any,data:any){
    event.stopPropagation()
    console.log(data.uri)
    this._musicPlayer.playmusic(data.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{console.log(res)
        this.play_button_show=false
      },
      complete:()=>{
        this._musicService.startInterval.next(true)
      }
    })

    this._musicPlayer.Button.next(true)
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
  
  show_album(id:string){
    console.log(id);
    this.router.navigate(['/album',id])
  }

  switchalbum(value:string){
    console.log(value);
    this.album_type=value;
    this.artists_album()
  }

  show_artists(i:any){
    console.log(i);
    this.activeRoute.params.subscribe(routeParams => {
    this.id=i.id
    });
    this.router.navigate(['/artists',i.id])
    this.activeRoute.params.pipe(takeLast(1)).subscribe((data:any) => {
      this.id=data.id
      });
      this.data={}
    this.artists_data() 
    this.scrollup.nativeElement.scrollTo( 0, 0 );
  }

  show_all_artists(){
    this.router.navigate([`/artists/${this.id}/related`])
  }

  discography(){
    this.router.navigate([`/artists/${this.id}/discography`])
  }

  artist_comp(event:any,id:string){
    event.stopPropagation();
    console.log(id);
    this.router.navigate(['/artists',id])
    this.activeRoute.params.pipe(takeLast(1)).subscribe((data:any) => {
      this.id=data.id
      });
      this.data={}
    this.artists_data()
  }

  follow(id:any){  
    this._musicService.follow_artists(id).subscribe((res)=>{
      this.follow_button_show=true
      this._musicService.updateList.next(true)
    })
  }

  unfollow(id:string){
    this._musicService.unfollow_artists(id).subscribe((res)=>{
      this.follow_button_show=false
      this._musicService.updateList.next(true)
    })
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
