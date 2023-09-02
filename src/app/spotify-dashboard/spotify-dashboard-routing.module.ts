import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpotifyDashboardComponent } from './spotify-dashboard.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SectionComponent } from './section/section.component';
import { AlbumComponent } from './album/album.component';
import { TrackComponent } from './track/track.component';
import { ArtistsComponent } from './artists/artists.component';
import { RealtedComponent } from './realted/realted.component';
import { DiscographyComponent } from './discography/discography.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';

const routes: Routes = [
  { path: '',component: SpotifyDashboardComponent,children:[
    {path:'',component:HomeComponent},
    {path:'user',component:UserProfileComponent},
    {path:'search',component:SearchComponent},
    {path:'playlist/:id',component:PlaylistComponent},
    {path:'album/:id',component:AlbumComponent},
    {path:'section/:id',component:SectionComponent},
    {path:'track/:id',component:TrackComponent},
    {path:'artists/:id',component:ArtistsComponent},
    {path:'artists/:id/related',component:RealtedComponent},
    {path:'artists/:id/discography',component:DiscographyComponent},
    {path:'create-playlist',component:CreatePlaylistComponent}
    // {path:'**',redirectTo:'',pathMatch:'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpotifyDashboardRoutingModule { }
