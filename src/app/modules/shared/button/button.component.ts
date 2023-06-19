import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() buttonText: string;
  @Input() passedClass: string = '';
  @Input() loading: boolean;
  @Input() disabled: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
