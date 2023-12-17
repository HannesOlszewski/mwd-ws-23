import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { DatabasesComponent } from './databases/databases.component';
import { DatabaseTablesComponent } from './database-tables/database-tables.component';
import { DatabaseTableColumnsComponent } from './database-table-columns/database-table-columns.component';
import { DatabaseTableRowsComponent } from './database-table-rows/database-table-rows.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { DatabaseTableNewDialogComponent } from './database-table-new-dialog/database-table-new-dialog.component';
import { DatabaseTableDeleteDialogComponent } from './database-table-delete-dialog/database-table-delete-dialog.component';
import { DatabaseTableColumnNewDialogComponent } from './database-table-column-new-dialog/database-table-column-new-dialog.component';
import { DatabaseTableColumnDeleteDialogComponent } from './database-table-column-delete-dialog/database-table-column-delete-dialog.component';
import { DatabaseTableRowNewDialogComponent } from './database-table-row-new-dialog/database-table-row-new-dialog.component';
import { DatabaseTableRowEditDialogComponent } from './database-table-row-edit-dialog/database-table-row-edit-dialog.component';
import { DatabaseTableRowDeleteDialogComponent } from './database-table-row-delete-dialog/database-table-row-delete-dialog.component';

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
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DatabasesComponent,
    DatabaseTablesComponent,
    DatabaseTableColumnsComponent,
    DatabaseTableRowsComponent,
    BreadcrumbsComponent,
    DatabaseTableNewDialogComponent,
    DatabaseTableDeleteDialogComponent,
    DatabaseTableColumnNewDialogComponent,
    DatabaseTableColumnDeleteDialogComponent,
    DatabaseTableRowNewDialogComponent,
    DatabaseTableRowEditDialogComponent,
    DatabaseTableRowDeleteDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
