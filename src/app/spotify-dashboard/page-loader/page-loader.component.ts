import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent {

  constructor(private pageLoader:MatDialogRef<PageLoaderComponent>){
    this.pageLoader.disableClose=true
  }

}
