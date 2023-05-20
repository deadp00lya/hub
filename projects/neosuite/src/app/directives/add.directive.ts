import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAdd]'
})
export class AddDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
