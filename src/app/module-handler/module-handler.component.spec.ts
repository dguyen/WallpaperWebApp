import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleHandlerComponent } from './module-handler.component';

describe('ModuleHandlerComponent', () => {
  let component: ModuleHandlerComponent;
  let fixture: ComponentFixture<ModuleHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
