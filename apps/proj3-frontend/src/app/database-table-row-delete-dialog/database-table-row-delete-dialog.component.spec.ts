import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableRowDeleteDialogComponent } from './database-table-row-delete-dialog.component';

describe('DatabaseTableRowDeleteDialogComponent', () => {
  let component: DatabaseTableRowDeleteDialogComponent;
  let fixture: ComponentFixture<DatabaseTableRowDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableRowDeleteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableRowDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
