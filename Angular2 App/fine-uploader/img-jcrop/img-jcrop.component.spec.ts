import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgJcropComponent } from './img-jcrop.component';

describe('ImgJcropComponent', () => {
  let component: ImgJcropComponent;
  let fixture: ComponentFixture<ImgJcropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgJcropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgJcropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
