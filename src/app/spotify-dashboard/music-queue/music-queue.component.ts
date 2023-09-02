import { Component,OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MusicApiService } from 'src/app/service/music-api.service';

@Component({
  selector: 'app-music-queue',
  templateUrl: './music-queue.component.html',
  styleUrls: ['./music-queue.component.scss']
})
export class MusicQueueComponent implements OnInit {
  constructor(private _bottomSheetRef: MatBottomSheetRef<MusicQueueComponent>,private _musicService:MusicApiService) {}

  ngOnInit()
  {
    this._musicService.get_queue().subscribe({
      next:(res)=>{console.log(res);}
    })
  }

  close_sheet(){
    this._bottomSheetRef.dismiss();
  }
}
