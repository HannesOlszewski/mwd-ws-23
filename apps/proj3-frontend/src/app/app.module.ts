import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { DatabasesComponent } from './databases/databases.component';
import { DatabaseTablesComponent } from './database-tables/database-tables.component';
import { DatabaseTableColumnsComponent } from './database-table-columns/database-table-columns.component';
import { DatabaseTableRowsComponent } from './database-table-rows/database-table-rows.component';

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
    MatTableModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DatabasesComponent,
    DatabaseTablesComponent,
    DatabaseTableColumnsComponent,
    DatabaseTableRowsComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
