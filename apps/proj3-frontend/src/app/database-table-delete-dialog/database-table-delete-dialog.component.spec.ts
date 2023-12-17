import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableDeleteDialogComponent } from './database-table-delete-dialog.component';

describe('DatabaseTableDeleteDialogComponent', () => {
  let component: DatabaseTableDeleteDialogComponent;
  let fixture: ComponentFixture<DatabaseTableDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableDeleteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
