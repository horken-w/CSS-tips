import { Component } from '@angular/core';
import {CourseService} from './course.service';


@Component({
	selector: 'authors',
	template: `
			{{authorTitle}} 
			<h2>Title for the author pages!!</h2>
			<ul>
				<li *ngFor='let author of authors'>{{author}}</li>
			</ul>
			`,
	providers: [CourseService]
})
export class AuthorsComponent{
	authors: string[];
	authorTitle: string = 'Author list';
	constructor(courseService: CourseService) {
		this.authors = courseService.getAuthor();
		console.log(this.authors);
	}
}