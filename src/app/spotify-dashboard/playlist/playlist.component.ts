import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ResolveEnd, Router, RouterEvent } from '@angular/router';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { filter, take } from 'rxjs';
import { MusicPlayerService } from 'src/app/service/music-player.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { PlaylistModalComponent } from '../playlist-modal/playlist-modal.component';
import { PageLoaderComponent } from '../page-loader/page-loader.component';
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  searchColumns=['Track', 'Time']
  displayedColumns= ['#', 'Track', 'Album','Date added', 'Time'];
  id=''
  data:any
  testing=true
  containerStyle:any={}
  play_button_show=true
  resume_button=false
  tracks: any[]=[];
  searchTracks: any[]=[];
  dataSource:any
  curr_playing: string='';
  check_functionality:any[]=[]
  editBlock=false
  trackSource:any
  snapshot_id=''
  @ViewChild('scrollup') scrollup!:ElementRef
  device_ID= '';
  defaultImg='../../../assets/defalut_playlist.jpg'
  follow=false
  dialogRef:MatDialogRef<PlaylistModalComponent> | undefined
  rowClicked: any;
  constructor(private activaterouter: ActivatedRoute, private router: Router,public _musicService:MusicApiService,private _musicPlayer:MusicPlayerService,private dialogModel: MatDialog
  )
  {}

  ngOnInit(): void { 
    this.dialogModel.open(PageLoaderComponent, {
      panelClass: 'my-loader-class'
    })
    this.routing_sub()
    this.playlist_data()
  }

  routing_sub(){
    this.activaterouter.params.subscribe((data:any) => {
      this.id=data.id

            this.router.events.pipe(
        filter((e: any): e is RouterEvent => e instanceof NavigationEnd),take(1)
     ).subscribe((event:any) => {
          let url=event.url
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
            else{
              this.play_button_show=true;
            }
          }
        })  
          this.data={}
          this.playlist_data()
          this.scrollup?.nativeElement.scrollTo( 0, 0 );
      }
      });
      
    });

    this._musicPlayer.PlayingMusicID.subscribe({next:(res)=>{
      this.curr_playing=res
    }}
      
    )
    


  }

  playlist_data(){
    this.check_user_follow()

    this._musicService.get_playlist(this.id).subscribe({
      next:(res:any)=>{
        this.data=res;
        this.snapshot_id=res.snapshot_id
        this.tracks=res?.tracks?.items
      },
      error:(err)=>{console.error(err)},
      complete:()=>{
        let userid=''
        this._musicService.user_profile().subscribe({
          next:(res:any)=>{
            userid=res.id
          },
          complete:()=>{
            if (userid==this.data.owner.id) {
              
              this.editBlock=true
            }
            else{
              this.editBlock=false
            }
          }
        })
        this.dataSource = new MatTableDataSource(this.tracks);  
        this.containerStyle={
          'background-image':`linear-gradient(#958f8f, #242424)`
        }
        // this.dialogModel.open(PageLoaderComponent)
        this.dialogModel.closeAll()
      }
    })
  }

  play_song(i:any){

    this._musicPlayer.playtrack(i.track.uri,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{},
      error:(err)=>{console.error('Play Music Error',err);},
      complete:()=>{
        this._musicPlayer.Button.next(true)
        this.play_button_show=false
        this._musicService.startInterval.next(true)
      }
    })

  }

  play_playlist(event:any ,data:any){

    event.stopPropagation();
   

    this._musicPlayer.playmusic(data,this._musicPlayer.DeviceID).subscribe({
      next:(res:any)=>{
        this.play_button_show=false
      },
      complete:()=>{
        this._musicPlayer.Button.next(true)
        this._musicPlayer.MUSIC_ALBUM_PLAYLIST.next(this.id)
        this._musicService.startInterval.next(true)
   
      }
    })
  }

  pause_playlist(event:any){
    event.stopPropagation();
    this._musicPlayer.spotifyPlayer.pause().then(() => {

      this.play_button_show=true;
      this.resume_button=true
      this._musicPlayer.Button.next(false)
  });
  }

  show_album(event:any,data:any){
    event.stopPropagation();

    this.router.navigate(['/album',data.track.album.id])
  }

  show_artists(event:any,id:string){
    event.stopPropagation();

    this.router.navigate(['/artists',id])
  }

  show_track(event: any, id: string) {
    event.stopPropagation()

    this.router.navigate(['track',id])
  }

  resume(event:any){
    event.stopPropagation();
    this.play_button_show=false;
    this.resume_button=false
    this._musicPlayer.spotifyPlayer.togglePlay().then(() => {});
    this._musicPlayer.ResumeButton.next(true)
  }



  editplaylistImage(){
  
  }
  preview(event:any) {
    let image=''
    let mod=''
    if(((event.target.files[0].size/3)*4)<256000){

      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0]);
         reader.onload = (event:any) => 
         {
          image=event.target.result
          mod=image.replace('data:image/jpeg;base64,' , '')
 
          this.defaultImg=event.target.result
         }
        this._musicService.update_playlist_image(mod,this.id).subscribe({
          next:(res:any)=>{}
        })
    }
    else{
      alert('Only 250-Kb Allowed')
    }

  }

  search_song(value:string){
    if (value.length>=4) {
      
      this._musicService.search_api(value,6).subscribe({
        next:(res:any)=>{
          this.searchTracks=res.tracks.items
          this.trackSource = new MatTableDataSource(this.searchTracks);
        },error:(err)=>{console.log(err)},
        complete:()=>{
          
        }
      })
    }
    else{alert('Minimum 4 Letters are Required')}
  }

  addtrack(event:any,data:any){
    event.stopPropagation();
    this._musicService.add_track_playlist(this.id,data).subscribe({
      next:(res)=>{console.log(res);},
      complete:()=>{
        this.playlist_data()
      }
    })
  }

  menuOption(event:any){
    event.stopPropagation();
  }

  remove_track(data:any,index:number){
    this._musicService.remove_track_playlist(this.id,data.track.uri,index).subscribe({
      next:(res)=>{},
      complete:()=>{
        this.playlist_data()
      }
    })
    this.rowClicked=100
  }

  add_track_queue(data:any){
    this._musicService.add_track_queue(data.track.uri).subscribe()
    this.rowClicked=100
  }

  add_track_playlist(data:any){
    this.dialogRef=this.dialogModel.open(PlaylistModalComponent,{
      data:{
        id:data.track?.uri
      }
    })
    this.rowClicked=100
  }

  follow_playlist(data:any){
    this._musicService.follow_playlist(data.id).subscribe({
      complete:()=>{
      this.follow=true
      this._musicService.updateList.next(true)
    }
  })
}


unfollow_playlist(data:any){
  
  this._musicService.unfollow_playlist(data.id).subscribe({
    complete:()=>{
      this.follow=false
      this._musicService.updateList.next(true)
    }
    })

  }

  check_user_follow(){
    let userid=''
    this._musicService.user_profile().subscribe({
      next: (res: any) => {
        userid = res.id
      },
      complete:()=>{
        this._musicService.check_playlist_followed(this.id,userid).subscribe({
          next:(res:any)=>{this.follow=res[0]}
        })
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

