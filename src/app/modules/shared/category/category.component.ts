import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SlickCarouselComponent } from 'ngx-slick-carousel';

interface Category {
  title: string;
  value: string;
  img: string;
}
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit {
  @Input() selectedCategory: string | null = 'glamping';
  categories: Category[] = [
    {
      title: 'Glamping',
      value: 'glamping',
      img: 'assets/images/glamping.png'
    },
    {
      title: 'Cabins',
      value: 'cabins',
      img: 'assets/images/cabin.png'
    },
    {
      title: 'RVs',
      value: 'RVs',
      img: 'assets/images/rvs.png'
    },
    {
      title: 'Deep Sea fishing',
      value: 'Deep Sea fishing',
      img: 'assets/images/deepseafishing.png'
    },
    {
      title: 'Camping Gear',
      value: 'Camping gear',
      img: 'assets/images/campinggear.png'
    },
    {
      title: 'Fashion',
      value: 'fashion',
      img: 'assets/images/fashion.png'
    },
    {
      title: 'Fitness',
      value: 'Fitness',
      img: 'assets/images/fitness.png'
    },
    {
      title: 'Travel',
      value: 'Travel',
      img: 'assets/images/travel.png'
    },
    {
      title: 'Food',
      value: 'Food',
      img: 'assets/images/food.png'
    },
    {
      title: 'Camping Spot',
      value: 'Camping Spot',
      img: 'assets/images/campingspot.webp'
    }
  ]
  constructor(private router: Router) { }
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  @Input() slider: boolean = false;
  slideConfig = {
    arrows: false,
    slidesToShow: 10.2,
    infinite: false,
    responsive: [
      {
        breakpoint: 1240,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
    },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };
  ngOnInit(): void {
  }

  onCategoryClick(category: Category){
    this.router.navigate(['categories'],{queryParams: {category: category.value}})
  }

}
