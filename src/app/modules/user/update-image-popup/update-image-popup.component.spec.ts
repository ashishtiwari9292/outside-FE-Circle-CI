import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateImagePopupComponent } from './update-image-popup.component';

describe('UpdateImagePopupComponent', () => {
  let component: UpdateImagePopupComponent;
  let fixture: ComponentFixture<UpdateImagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateImagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
