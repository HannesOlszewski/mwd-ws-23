import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableRowsComponent } from './database-table-rows.component';

describe('DatabaseTableRowsComponent', () => {
  let component: DatabaseTableRowsComponent;
  let fixture: ComponentFixture<DatabaseTableRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableRowsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
