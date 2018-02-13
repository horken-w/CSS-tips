import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTreeviewComponent } from './ng-treeview.component';

describe('NgTreeviewComponent', () => {
  let component: NgTreeviewComponent;
  let fixture: ComponentFixture<NgTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
