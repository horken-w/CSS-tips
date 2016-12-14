import { Component } from '@angular/core';
import { CoursesComponent} from './courses.component';
import { AuthorsComponent} from './authors.component';


@Component({
  selector: 'app',
	template: `<courses></courses>
						 <h1>World!!</h1>
						 <authors></authors>`,
	directives: [CoursesComponent, AuthorsComponent]
})
export class AppComponent{ }