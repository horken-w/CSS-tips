import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTreeviewItemComponent } from './ng-treeview-item.component';

describe('NgTreeviewItemComponent', () => {
  let component: NgTreeviewItemComponent;
  let fixture: ComponentFixture<NgTreeviewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgTreeviewItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTreeviewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
