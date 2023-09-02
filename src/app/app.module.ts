import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { ApiVerifyInterceptor } from './service/api-verify.interceptor';
import {MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './spotify-dashboard/home/home.component';
import {MatInputModule} from '@angular/material/input'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoginComponent } from './login/login.component';
import {MatMenuModule} from '@angular/material/menu';
import { SearchComponent } from './spotify-dashboard/search/search.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'  
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SearchComponent,
  ],
  imports: [
    NgbProgressbarModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    CarouselModule,
    MatMenuModule,
    MatInputModule,
    MatTableModule,
    NgbModule,MatButtonModule,MatDialogModule
  ],
  // providers:[],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:ApiVerifyInterceptor,multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
