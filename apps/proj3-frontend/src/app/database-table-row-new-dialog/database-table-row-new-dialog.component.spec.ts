import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableRowNewDialogComponent } from './database-table-row-new-dialog.component';

describe('DatabaseTableRowNewDialogComponent', () => {
  let component: DatabaseTableRowNewDialogComponent;
  let fixture: ComponentFixture<DatabaseTableRowNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableRowNewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableRowNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
