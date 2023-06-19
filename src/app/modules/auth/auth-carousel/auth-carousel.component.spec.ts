import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCarouselComponent } from './auth-carousel.component';

describe('AuthCarouselComponent', () => {
  let component: AuthCarouselComponent;
  let fixture: ComponentFixture<AuthCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
