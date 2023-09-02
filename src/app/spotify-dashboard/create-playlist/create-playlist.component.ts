import { Component, OnInit } from '@angular/core';
import { MusicApiService } from 'src/app/service/music-api.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss']
})
export class CreatePlaylistComponent  implements OnInit{

  constructor(private _musicApi:MusicApiService) {}

  ngOnInit(): void {
    let userid=''
    this._musicApi.user_profile().subscribe({
      next:(res:any)=>{
        console.log(res.id);
        userid=res.id
      },
      complete:()=>{
        this._musicApi.user_made_playlist(userid).subscribe({
          next:(res:any)=>{
            console.log(res);
          },
          complete:()=>{
            this._musicApi.user_saved_playlist().subscribe({
              next:(res)=>{console.log(res);}
            })
          }
        })
      }
    })
  }

  onSubmit(form:any){
    console.log(form.value);
  }

}
