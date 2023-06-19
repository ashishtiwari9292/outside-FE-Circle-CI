import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-block',
  templateUrl: './search-block.component.html',
  styleUrls: ['./search-block.component.scss']
})
export class SearchBlockComponent implements OnInit {
   
  @Input() showCategories: boolean = true;
  @Output() showCategiesEmitter =  new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }


  handleClick(value: boolean){
    this.showCategiesEmitter.emit(value);
  }
}
