import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostdGalleryComponent } from './post-gallery.component';

describe('DashboardComponent', () => {
  let component: PostdGalleryComponent;
  let fixture: ComponentFixture<PostdGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostdGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostdGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
