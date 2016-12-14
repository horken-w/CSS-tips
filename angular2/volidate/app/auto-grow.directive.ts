import { Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
	selector: '[autoGrow]',
	host: {
		'(focus)': 'onFocus()',
		'(blur)': 'onBlur()'
	}
})
export class AutoGrowDirective{

	constructor(private el: ElementRef, private renderer: Renderer){
		this.el = el.nativeElement;
	}
	onFocus(){
		this.renderer.setElementStyle(this.el, 'width', '200px');
	}
	onBlur(){
		this.renderer.setElementStyle(this.el, 'width', '150px');
	}
}