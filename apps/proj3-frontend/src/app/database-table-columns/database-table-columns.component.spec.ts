import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseTableColumnsComponent } from './database-table-columns.component';

describe('DatabaseTableColumnsComponent', () => {
  let component: DatabaseTableColumnsComponent;
  let fixture: ComponentFixture<DatabaseTableColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseTableColumnsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseTableColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
