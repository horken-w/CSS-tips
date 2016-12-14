import { Component } from '@angular/core';
import {CourseService} from './course.service';
import {AutoGrowDirective} from './auto-grow.directive'
@Component({
	selector: 'courses',
	template: `
				<h2>Hello!!</h2>
				{{title}} 
				<input class="timeing" type="text" autoGrow />
				<ul>
					<li *ngFor='let course of courses'>{{course}}</li>
				</ul>
				`,
	styles:[`
		.timeing{
			width: 150px;
			transition: width 1s;
		}
	`],
	providers: [CourseService],
	directives: [AutoGrowDirective]
})
export class CoursesComponent{
	title: string = "The title of courses page";
	courses; 
	constructor(courseService: CourseService){
		this.courses = courseService.getCourses();
	}
}