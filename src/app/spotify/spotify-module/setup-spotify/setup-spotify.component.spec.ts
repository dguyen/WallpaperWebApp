import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSpotifyComponent } from './setup-spotify.component';

describe('SetupSpotifyComponent', () => {
  let component: SetupSpotifyComponent;
  let fixture: ComponentFixture<SetupSpotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupSpotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupSpotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
