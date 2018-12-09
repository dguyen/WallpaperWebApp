import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyModuleComponent } from './spotify-module.component';

describe('SpotifyModuleComponent', () => {
  let component: SpotifyModuleComponent;
  let fixture: ComponentFixture<SpotifyModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotifyModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
