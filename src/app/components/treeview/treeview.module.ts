import { NgModule } from '@angular/core';
import { TreeviewComponent } from './treeview.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TreeviewComponent],
  imports: [CommonModule],
  exports: [TreeviewComponent],
})
export class TreeviewModule {}
