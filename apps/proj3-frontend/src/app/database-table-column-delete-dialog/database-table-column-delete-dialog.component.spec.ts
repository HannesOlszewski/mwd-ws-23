import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableColumnDeleteDialogComponent } from './database-table-column-delete-dialog.component';

describe('DatabaseTableColumnDeleteDialogComponent', () => {
  let component: DatabaseTableColumnDeleteDialogComponent;
  let fixture: ComponentFixture<DatabaseTableColumnDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableColumnDeleteDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableColumnDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
