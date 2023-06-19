import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Directive({
  selector: '[appIsLoggedIn]',
})
export class IsLoggedInDirective implements OnInit {
  @Input('appIsLoggedIn') showIfLoggedIn: boolean;
  constructor(private el: ElementRef, private sharedService: SharedService) {}
  ngOnInit() {
    this.sharedService.isLoggedIn$.subscribe((isLoggedIn)=>{
      this.el.nativeElement.style.display = (isLoggedIn && this.showIfLoggedIn)||(!isLoggedIn && !this.showIfLoggedIn)? 'flex' : 'none';
    })
    
  }
}
