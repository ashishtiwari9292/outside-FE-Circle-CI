import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-auth-carousel',
  templateUrl: './auth-carousel.component.html',
  styleUrls: ['./auth-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthCarouselComponent implements OnInit {
  constructor() {}

  slides = [
    { img: 'assets/images/slider-img-1.jpg' },
    { img: 'assets/images/slider-img-2.jpg' },
    { img: 'assets/images/slider-img-3.jpg' },
  ];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 1500,
    dots: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: false,
        },
      },
    ],
  };

  ngOnInit(): void {}
}
