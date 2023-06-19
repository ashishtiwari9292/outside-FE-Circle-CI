import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  @Input() margin: string='0';
  @Input() height: string='100%';
  @Input() width: string='100%';
  @Input() radius: string='6px';
  @Input() type: 'circle' | 'post-details' | 'profile' | 'comments-list' | 'comments' | 'bar' = 'bar';
  constructor() { }

  ngOnInit(): void {
  }

}
