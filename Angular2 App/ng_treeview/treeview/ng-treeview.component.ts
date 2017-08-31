import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'treeview',
  templateUrl: './ng-treeview.component.html',
  styleUrls: ['./ng-treeview.component.css']
})
export class NgTreeviewComponent implements OnInit {
  @Input() items: TemplateRef<any>;
  constructor() { }

  ngOnInit() { }
}
