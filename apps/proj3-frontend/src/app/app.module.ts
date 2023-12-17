import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { DatabasesComponent } from './databases/databases.component';
import { DatabaseTablesComponent } from './database-tables/database-tables.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DatabasesComponent,
    DatabaseTablesComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
