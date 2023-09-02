import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MusicApiService } from 'src/app/service/music-api.service';
import { MusicPlayerService } from 'src/app/service/music-player.service';

@Component({
  selector: 'app-playlist-modal',
  templateUrl: './playlist-modal.component.html',
  styleUrls: ['./playlist-modal.component.scss']
})
export class PlaylistModalComponent implements OnInit,OnDestroy {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<PlaylistModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public _musicService: MusicApiService, private _snackBar: MatSnackBar,private dialogModel: MatDialog) { }

  playlist: any[] = []

  ngOnInit() {
    let userid = ''
    let tempdata: any[] = []
    this._musicService.user_profile().subscribe({
      next: (res: any) => {
        userid = res.id
      },
      complete: () => {
        this._musicService.user_saved_playlist().subscribe({
          next: (res: any) => {
            tempdata = res.items
          },
          complete: () => {
            tempdata.filter((r: any) => {
              if (r.owner.id == userid) {
                this.playlist.push(r)
              }
            })
          }
        })
      }
    })
    console.log(this.playlist);

  }

  add_track(event: any, data: any) {
    event.stopPropagation();
    console.log(this.data.id);

    this._musicService.add_track_playlist(data.id,this.data.id).subscribe({
      next:(res)=>{console.log(res);},
      complete:()=>{
        this.dialogRef.close()
        this._snackBar.open('Song Added on Playlist','', {
          duration: 1000
        })
      }
    })
  }

  close(){
    this.dialogModel.closeAll()
  }

  ngOnDestroy(){

  }

}
