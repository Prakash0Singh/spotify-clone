import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpotifyDashboardRoutingModule } from './spotify-dashboard-routing.module';
import { SpotifyDashboardComponent } from './spotify-dashboard.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SectionComponent } from './section/section.component';
import {MatSliderModule} from '@angular/material/slider';
import { AlbumComponent } from './album/album.component'
import {MatTableModule} from '@angular/material/table'
import {MatChipsModule} from '@angular/material/chips';
import { TrackComponent } from './track/track.component';
import { ArtistsComponent } from './artists/artists.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RealtedComponent } from './realted/realted.component';
import { DiscographyComponent } from './discography/discography.component';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input'
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MusicQueueComponent } from './music-queue/music-queue.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
@NgModule({
  declarations: [
    SpotifyDashboardComponent,
    PlaylistComponent,
    SectionComponent,
    AlbumComponent,
    TrackComponent,
    ArtistsComponent,
    RealtedComponent,
    DiscographyComponent,
    UserProfileComponent,
    MusicPlayerComponent,
    CreatePlaylistComponent,
    PlaylistModalComponent,
    MusicQueueComponent,
    PageLoaderComponent,
  ],
  imports: [
    NgbProgressbarModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatSliderModule,
    MatChipsModule,
    CarouselModule,
    MatInputModule,MatMenuModule,MatBottomSheetModule,
    SpotifyDashboardRoutingModule,MatDialogModule,
    MatFormFieldModule,MatButtonModule,MatSnackBarModule,
    MatSelectModule,MatTooltipModule,MatRadioModule
  ]
})
export class SpotifyDashboardModule { }
