import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss'],
})
export class ProfileWidgetComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() editButton: string;
  @Input() followButton: string;
  @Input() img: string;
  @Output() onButtonClick = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  onClick() {
    this.onButtonClick.emit(true);
  }
}
