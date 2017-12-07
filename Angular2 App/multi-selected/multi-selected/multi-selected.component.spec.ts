import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectedComponent } from './multi-selected.component';

describe('MultiSelectedComponent', () => {
  let component: MultiSelectedComponent;
  let fixture: ComponentFixture<MultiSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
