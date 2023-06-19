import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sub-category',
    templateUrl: './sub-category.component.html',
    styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    data = [
        {
            title: 'Apparel',
            img: 'https://picsum.photos/200/200'
        },
        {
            title: 'Footwear',
            img: 'https://picsum.photos/201/201'
        },
        {
            title: 'Accessories',
            img: 'https://picsum.photos/206/206'
        },
        {
            title: 'Cosmetics',
            img: 'https://picsum.photos/205/205'
        },
        {
            title: 'Luggage',
            img: 'https://picsum.photos/210/210'
        },
        {
            title: 'Essentials',
            img: 'https://picsum.photos/220/220'
        },
    ]

}
