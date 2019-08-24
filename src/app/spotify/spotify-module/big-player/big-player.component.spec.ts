import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigPlayerComponent } from './big-player.component';

describe('BigPlayerComponent', () => {
  let component: BigPlayerComponent;
  let fixture: ComponentFixture<BigPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
