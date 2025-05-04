import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackWorkoutPage } from './track-workout.page';

describe('TrackWorkoutPage', () => {
  let component: TrackWorkoutPage;
  let fixture: ComponentFixture<TrackWorkoutPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
