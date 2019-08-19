import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSettingComponent } from './select-setting.component';

describe('SelectSettingComponent', () => {
  let component: SelectSettingComponent;
  let fixture: ComponentFixture<SelectSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
