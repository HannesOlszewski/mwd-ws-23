import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableRowEditDialogComponent } from './database-table-row-edit-dialog.component';

describe('DatabaseTableRowEditDialogComponent', () => {
  let component: DatabaseTableRowEditDialogComponent;
  let fixture: ComponentFixture<DatabaseTableRowEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableRowEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableRowEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
