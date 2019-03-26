import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutotableComponent } from './nutotable.component';

describe('NutotableComponent', () => {
  let component: NutotableComponent;
  let fixture: ComponentFixture<NutotableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutotableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutotableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
