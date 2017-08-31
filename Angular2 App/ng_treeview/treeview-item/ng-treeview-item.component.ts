import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';

@Component({
  selector: 'treeview-item',
  templateUrl: './ng-treeview-item.component.html',
  styleUrls: ['./ng-treeview-item.component.css']
})
export class NgTreeviewItemComponent {
  @Input() temp: TemplateRef<any>;
  @Input() item: any;
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor() { }

  onCollapseExpand(){
    this.item.collapsed = !this.item.collapsed;
  }

  onCheckedChange = () => {
    const check = this.item.checked;
    // if(this.item.menus) //select all child item
    //   this.selectedAllChild(this.item.menus, check);
    this.checkedChange.emit(check);
  }

  selectedAllChild(item, checked){
    item.forEach((v) => {
      v.checked = checked;
      if(v.menus) this.selectedAllChild(v.menus, checked);
    });
  }
}
