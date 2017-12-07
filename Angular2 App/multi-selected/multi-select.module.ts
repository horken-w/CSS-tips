import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectedComponent } from './multi-selected/multi-selected.component';
import {MultiSelectService} from "@techmore/multi-selected/multi-select.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MultiSelectedComponent
  ],
  exports:[
    MultiSelectedComponent
  ],
  providers: [
    MultiSelectService,
  ]
})
export class MultiSelectModule { }
