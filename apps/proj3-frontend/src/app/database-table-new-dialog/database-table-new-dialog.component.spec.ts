import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableNewDialogComponent } from './database-table-new-dialog.component';

describe('DatabaseTableNewDialogComponent', () => {
  let component: DatabaseTableNewDialogComponent;
  let fixture: ComponentFixture<DatabaseTableNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableNewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
