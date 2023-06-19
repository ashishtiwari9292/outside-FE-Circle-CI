import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective {
  @Input() isFocus: boolean;
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.isFocus) {
      window.setTimeout(() => {
        this.el.nativeElement.focus();
      });
    }
  }
}
