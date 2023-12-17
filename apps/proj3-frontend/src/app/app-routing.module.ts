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

const appRoutes: Routes = [
  {
    path: 'databases',
    children: [
      {
        path: ':database',
        component: DatabaseTablesComponent,
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
