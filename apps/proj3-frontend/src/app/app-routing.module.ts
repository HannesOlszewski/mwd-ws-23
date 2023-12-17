import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DatabasesComponent } from './databases/databases.component';
import { DatabaseTablesComponent } from './database-tables/database-tables.component';
import { DatabaseTableColumnsComponent } from './database-table-columns/database-table-columns.component';
import { DatabaseTableRowsComponent } from './database-table-rows/database-table-rows.component';

const appRoutes: Routes = [
  {
    path: 'databases',
    children: [
      {
        path: ':database',
        children: [
          {
            path: ':table',
            children: [
              {
                path: 'columns',
                component: DatabaseTableColumnsComponent,
              },
              { path: 'rows', component: DatabaseTableRowsComponent },
            ],
          },
          { path: '', component: DatabaseTablesComponent },
        ],
      },
      { path: '', component: DatabasesComponent },
    ],
  },
  { path: '', redirectTo: '/databases', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }, // <-- debugging purposes only
    ),
  ],
  exports: [RouterModule],
  providers: [provideRouter(appRoutes, withComponentInputBinding())],
})
export class AppRoutingModule {}
