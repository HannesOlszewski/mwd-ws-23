import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableColumnNewDialogComponent } from './database-table-column-new-dialog.component';

describe('DatabaseTableColumnNewDialogComponent', () => {
  let component: DatabaseTableColumnNewDialogComponent;
  let fixture: ComponentFixture<DatabaseTableColumnNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableColumnNewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableColumnNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
