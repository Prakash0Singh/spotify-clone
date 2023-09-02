import { Component, OnInit, OnDestroy } from '@angular/core';

import { MusicPlayerService } from 'src/app/service/music-player.service';
/// <reference path="../node_modules/@types/spotify-web-playback-sdk/index.d.ts"/>
@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  constructor(private _musicPlayer:MusicPlayerService) {}

  ngOnInit(): void {
    let token=localStorage.getItem("token")||''
    // this._musicPlayer.createWebPlayer(token)
  }

}
