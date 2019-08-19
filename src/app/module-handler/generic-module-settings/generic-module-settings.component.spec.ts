import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericModuleSettingsComponent } from './generic-module-settings.component';

describe('GenericModuleSettingsComponent', () => {
  let component: GenericModuleSettingsComponent;
  let fixture: ComponentFixture<GenericModuleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericModuleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericModuleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
