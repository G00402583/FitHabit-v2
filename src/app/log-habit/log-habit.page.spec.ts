import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogHabitPage } from './log-habit.page';

describe('LogHabitPage', () => {
  let component: LogHabitPage;
  let fixture: ComponentFixture<LogHabitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogHabitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
