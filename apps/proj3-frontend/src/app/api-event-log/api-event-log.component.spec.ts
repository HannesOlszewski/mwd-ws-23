import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiEventLogComponent } from './api-event-log.component';

describe('ApiEventLogComponent', () => {
  let component: ApiEventLogComponent;
  let fixture: ComponentFixture<ApiEventLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiEventLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiEventLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
