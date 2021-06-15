import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent, ListComponent, ListItemComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, ListComponent, ListItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
